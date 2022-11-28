pipeline {
    agent any

    stages {
        stage('Build Docker Image') {
            steps {
                sh 'docker build -t ms-nanban .'
            }
        }
        // stage('Copy Templates & Assets') {
        //     steps {
        //         sh 'cp -a ./src/shared/mail/templates/ ./dist/shared/mail/'
        //     }
        // }
        stage('Copy Templates & Assets') {
            steps {
                sh script:'''
                #!/bin/bash
                cd ./dist
                ls -a
                echo "Displaying dist"
              '''
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