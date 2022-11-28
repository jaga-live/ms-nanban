pipeline {
    agent any

    stages {
        stage('Build ms-nanban') {
            steps {
                sh 'docker build -t ms-nanban .'
            }
        }
        stage('Run unit tests') {
            steps {
                sh 'docker run ms-nanban npm run test'
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