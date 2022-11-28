pipeline {
    agent any

    stages {
        stage('Build Docker Image') {
            steps {
                sh 'docker build -t ms-nanban .'
            }
        }
        stage('Copy Templates & Assets') {
            steps {
                sh "chmod +x ./scripts/copy.sh"
                sh "./scripts/copy.sh"

            }
        }
        stage('Stop Existing Container') {
            steps {
                sh 'docker rm ms-nanban --force'
            }
        }
        stage('Start new Container') {
            steps {
                sh 'docker run -p 5002:5000 -d --name ms-nanban ms-nanban'
            }
        }

    }
}