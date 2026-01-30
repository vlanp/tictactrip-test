/* Requires the Docker Pipeline plugin */
pipeline {
    agent { dockerfile true }
    stages {
        stage('build') {
            steps {
                sh 'pnpm build'
            }
        }
        stage('test') {
            steps {
                sh 'pnpm test'
            }
        }
        stage('Deliver') {
            steps {
                sh 'pnpm start'
            }
        }
    }
}
