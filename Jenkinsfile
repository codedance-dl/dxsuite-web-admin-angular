pipeline {
  agent {
    label "nodejs"
  }
  options {
    timestamps()
    timeout(time: 10, unit: 'MINUTES')
  }
  stages {
    stage('安装依赖') {
      steps {
        sh "yarn install"
      }
    }
    stage ('eslint & stylelint 检查') {
      failFast true
      parallel {
        stage('eslint检查') {
          steps {
              sh "yarn run eslint:report"
          }
        }
        stage('stylelint检查') {
          steps {
              sh "yarn run stylelint:report"
          }
        }
      }
    }
    stage('代码扫描') {
      environment {
        PROJECT_NAME = "dxsuite-ng-admin:${env.GIT_BRANCH}"
      }
      steps {
        withSonarQubeEnv("SonarQube") {
          sh "sonar-scanner -Dsonar.qualitygate.wait=true -Dsonar.projectKey=${env.PROJECT_NAME} -Dsonar.projectName=${env.PROJECT_NAME}"
        }
      }
    }
    stage('开发环境编译') {
      when {
        branch 'development'
      }
      steps {
        sh "yarn run build:dev"
      }
    }
    stage('生产环境编译') {
      when {
        branch 'master'
      }
      steps {
        sh "yarn run build"
      }
    }
    stage('开发环境发布') {
      when {
        branch 'development'
      }
      steps {
        sh "yarn run release:dev"
      }
    }
    stage('生产环境发布') {
      when {
        beforeInput true
        branch 'master'
      }
      input {
        message '确认发布到生产环境吗？'
        ok '发布'
      }
      steps {
        sh "yarn run release"
      }
    }
  }
  post {
      // 构建失败则发送邮件，接收方使用了gitlab的环境变量获取提交代码用户的用户名
      failure {
          emailext body: """<p>FAILED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]':</p>
                              <p>Check console output at "<a href="${env.BUILD_URL}">${env.JOB_NAME} [${env.BUILD_NUMBER}]</a>"</p>""",
          subject: "[FAILED]: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
          recipientProviders: [developers(), requestor()]
      }
  }
}