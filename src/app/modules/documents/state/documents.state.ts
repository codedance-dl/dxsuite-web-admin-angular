import { NzMessageService } from 'ng-zorro-antd/message';
import { forkJoin, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { Injectable } from '@angular/core';
import { FilesService } from '@api/files.service';
import { DataServiceResult } from '@api/models';
import { FileEntry } from '@api/models/files';
import { Action, createSelector, Selector, State, StateContext, Store } from '@ngxs/store';
import { AuthState } from '@store/auth';

import { DocumentActions } from './documents.actions';

const LOCAL_DOCUMENT_VIEW_MODE = 'documentViewMode';

export enum DocumentsViewMode {
  List = 'list',
  Card = 'card'
}

export interface DocumentsStateModel {
  loaded: boolean;
  viewMode: DocumentsViewMode;
  entriesMap: { [key: string]: FileEntry[] };
  breadcrumbs: FileEntry[];
}

const getLocalViewMode = () => {
  const viewMode: string = localStorage.getItem(LOCAL_DOCUMENT_VIEW_MODE);
  if (viewMode && viewMode === 'list') {
    return DocumentsViewMode.List;
  } else if (viewMode && viewMode === 'card') {
    return DocumentsViewMode.Card;
  } else {
    return DocumentsViewMode.List;
  }
};

export const initialState = (): DocumentsStateModel => ({
  loaded: false,
  viewMode: getLocalViewMode(),
  entriesMap: {},
  breadcrumbs: []
});

const DOCUMENTS_ROOT_ID = environment.orgId;

@State<DocumentsStateModel>({
  name: 'documents',
  defaults: initialState()
})
@Injectable()
export class DocumentsState {

  orgId = environment.orgId;

  constructor(
    private store: Store,
    private service: FilesService,
    private message: NzMessageService
  ) { }

  static selectCurrentDirectory(directoryId: string = DOCUMENTS_ROOT_ID) {
    return createSelector([DocumentsState], (state: DocumentsStateModel) =>
      state.entriesMap[directoryId]
    );
  }

  static isEmptyDirectory(directoryId: string = DOCUMENTS_ROOT_ID) {
    return createSelector([DocumentsState.selectCurrentDirectory(directoryId)], (entries: FileEntry[] = []) =>
      entries.length === 0
    );
  }

  @Selector()
  static selectViewMode(state: DocumentsStateModel) {
    return state.viewMode;
  }

  @Selector()
  static selectDirectoryBreadcrumbs(state: DocumentsStateModel) {
    return state.breadcrumbs;
  }

  @Selector()
  static isLoaded(state: DocumentsStateModel) {
    return state.loaded;
  }

  @Action(DocumentActions.GetRootDirectory, { cancelUncompleted: true })
  getRootDirectory(state: StateContext<DocumentsStateModel>) {
    const user = this.store.selectSnapshot(AuthState.getIdentity);
    return this.service.getRootDirectoryByOwner(this.orgId, (user || {}).id).pipe(tap(result => {
      const entriesMap = { ...state.getState().entriesMap };
      entriesMap[DOCUMENTS_ROOT_ID] = result.data.filter(item => item.depth === 0);
      state.patchState({ entriesMap, loaded: true });
    }));
  }

  @Action(DocumentActions.GetDirectory, { cancelUncompleted: true })
  getNestedDirectory(state: StateContext<DocumentsStateModel>, { directoryId, query }: DocumentActions.GetDirectory) {
    const user = this.store.selectSnapshot(AuthState.getIdentity);
    if (query.sortBy && typeof query.sortBy === 'string') {
      if (query.sortBy.indexOf('isDirectory:desc') === -1) {
        query.sortBy = query.sortBy.split(',');
        query.sortBy.unshift('isDirectory:desc');
      }
    }
    return this.service.getFilesByOwnerAndDirectory(this.orgId, (user || {}).id, directoryId, query)
      .pipe(tap(result => {
        const entriesMap = { ...state.getState().entriesMap };
        entriesMap[directoryId] = result.data;
        state.patchState({ entriesMap, loaded: true });
      }));
  }

  @Action(DocumentActions.GetDirectoryBreadcrumbs, { cancelUncompleted: true })
  getDirectoryBreadcrumbs(state: StateContext<DocumentsStateModel>, { directoryId }: DocumentActions.GetDirectoryBreadcrumbs) {
    if (directoryId) {
      return this.service.getFileDetail(this.orgId, directoryId).pipe(tap(result => {
        const currentFile = result.data;
        const parents = result.data.parents;
        let currentEntry = parents.find(item => item.id === currentFile.parentId);
        const breadcrumbs: FileEntry[] = [];
        if (currentFile) {
          breadcrumbs.push(currentFile);
        }
        while (currentEntry) {
          breadcrumbs.unshift(currentEntry);
          currentEntry = parents.find(item => item.id === currentEntry.parentId);
        }
        state.patchState({ breadcrumbs });
      }));
    } else {
      const breadcrumbs: FileEntry[] = [];
      state.patchState({ breadcrumbs });
    }
  }

  @Action(DocumentActions.ChangeViewMode)
  changeViewMode(state: StateContext<DocumentsStateModel>, action: DocumentActions.ChangeViewMode) {
    state.patchState({ viewMode: action.viewMode });
    localStorage.setItem(LOCAL_DOCUMENT_VIEW_MODE, action.viewMode);
  }

  @Action(DocumentActions.ClearCache)
  clearCache(state: StateContext<DocumentsStateModel>) {
    state.setState(initialState());
  }

  @Action(DocumentActions.CreateDirectory, { cancelUncompleted: true })
  createDirectory(state: StateContext<DocumentsStateModel>, { name, directoryId }: DocumentActions.CreateDirectory) {
    if (directoryId) {
      return this.service.createChild(this.orgId, directoryId, { name, isDirectory: true }).pipe(
        catchError(error => {
          this.message.create('error', error?.error?.message || error?.error?.code);
          return of(null);
        }),
        tap((result) => {
          if (result) {
            const entriesMap = { ...state.getState().entriesMap };

            const originalEntries = [...entriesMap[directoryId] || []];
            originalEntries.splice(0, 0, result.data);
            entriesMap[directoryId] = originalEntries;
            state.patchState({ entriesMap, loaded: true });
            this.message.create('success', '新建文件夹成功');
          }
        })
      );
    } else {
      return this.service.create(this.orgId, { name, isDirectory: true }).pipe(
        catchError(error => {
          this.message.create('error', error?.error?.message || error?.error?.code);
          return of(null);
        }),
        tap((result) => {
          if (result) {
            const entriesMap = { ...state.getState().entriesMap };
            entriesMap[DOCUMENTS_ROOT_ID] = [...entriesMap[DOCUMENTS_ROOT_ID] || [], result.data];
            state.patchState({ entriesMap, loaded: true });
            this.message.create('success', '新建文件夹成功');
          }
        })
      );
    }
  }

  @Action(DocumentActions.DeleteFiles)
  deleteFiles(state: StateContext<DocumentsStateModel>, { parentId, fileIds }: DocumentActions.DeleteFiles) {
    const requestList = [];

    for (const fileId of fileIds) {
      requestList.push(this.service.delete(this.orgId, fileId).pipe(
        catchError(() => of({ success: false, data: fileId })),
        switchMap((res: DataServiceResult) => of({ success: res.success, data: fileId }))
      ));
    }

    return forkJoin(requestList).pipe(
      tap((res: DataServiceResult[]) => {
        const successIds = [];
        res.forEach(item => {
          if (item.success) {
            successIds.push(item.data);
          }
        });
        const directoryId = parentId || DOCUMENTS_ROOT_ID;

        const entriesMap = { ...state.getState().entriesMap };
        let originalFiles = [...entriesMap[directoryId]];

        originalFiles = originalFiles.filter(item => !successIds.includes(item.id));

        entriesMap[directoryId] = originalFiles;
        state.patchState({ entriesMap, loaded: true });

      }),
      tap(() => {
        this.message.create('success', '删除成功');
      })
    );
  }

  @Action(DocumentActions.InsertFile)
  insertFile(state: StateContext<DocumentsStateModel>, { directoryId, file }: DocumentActions.InsertFile) {
    const entriesMap = { ...state.getState().entriesMap };
    entriesMap[directoryId || DOCUMENTS_ROOT_ID] = [...entriesMap[directoryId || DOCUMENTS_ROOT_ID] || [], file];
    state.patchState({ entriesMap, loaded: true });
  }

  @Action(DocumentActions.MoveFiles)
  moveFile(state: StateContext<DocumentsStateModel>, { parentId, fileIds, target }: DocumentActions.MoveFiles) {
    const requestList = [];

    for (const fileId of fileIds) {
      requestList.push(this.service.moveTo(this.orgId, fileId, target).pipe(
        catchError(() => of({ success: false, data: fileId })),
        switchMap((res: DataServiceResult) => of({ success: res.success, data: fileId }))
      ));
    }

    return forkJoin(requestList).pipe(
      tap((res: DataServiceResult[]) => {
        const successIds = [];
        for (const item of res) {
          if (item.success) {
            successIds.push(item.data);
          }
        }
        const directoryId = parentId || DOCUMENTS_ROOT_ID;

        const entriesMap = { ...state.getState().entriesMap };
        let originalFiles = [...entriesMap[directoryId]];

        originalFiles = originalFiles.filter(item => !successIds.includes(item.id));

        entriesMap[directoryId] = originalFiles;
        state.patchState({ entriesMap, loaded: true });

      }),
      tap((res) => {
        const errData = res.filter(item => !item.success);
        if (errData[0]) {
          this.message.warning(`${errData.length}个文件移动失败`);
        } else {
          this.message.success('移动成功');
        }

      })
    );
  }
}
