/* groovylint-disable-next-line CompileStatic */
pipeline {
  agent any
  environment {
      NVM_DIR = '/var/lib/jenkins/.nvm'
      GIT_SSH_COMMAND = "ssh -vvv -i ${env.JENKINS_HOME}/.ssh/id_ed25519"
  }
  stages {
    stage('Pull') {
      steps {
        sh '''
            cd /var/www/ng-attila-client-v2
            git checkout main
            git reset --hard HEAD
            git pull
        '''
      }
    }
    stage('Install and build') {
      steps {
        sh """
            . ${NVM_DIR}/nvm.sh
            nvm use --silent 16.20.0
            cd /var/www/ng-attila-client-v2
            npm install --legacy-peer-deps
            npm run build
        """
      }
    }
  }
  post {
    always {
      cleanWs()
    }
  }
}
