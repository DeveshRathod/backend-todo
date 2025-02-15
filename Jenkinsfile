pipeline {
    agent any
    environment {
        DB_NAME = credentials('DB_NAME')
        DB_USER = credentials('DB_USER')
        DB_PASS = credentials('DB_PASS')
        DB_HOST = credentials('DB_HOST')
        DB_PORT = credentials('DB_PORT')
        JWT_SECRET = credentials('JWT_SECRET')
        PORT = credentials('PORT')
        LOCATION = credentials('LOCATION')

        AWS_ACCESS_KEY = credentials('AWS_ACCESS_KEY')
        AWS_SECRET_KEY = credentials('AWS_SECRET_KEY')
        AWS_ECR_PASSWORD = credentials('AWS_ECR_PASSWORD')
    }
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/DeveshRathod/backend-todo'
            }
        }
        stage('Build Docker Image') {
            steps {
                sh 'docker build -t backend .'
            }
        }
        stage('Login to AWS ECR') {
            steps {
                sh '''
                echo $AWS_ECR_PASSWORD | docker login --username AWS --password-stdin 038462784201.dkr.ecr.ap-south-1.amazonaws.com
                '''
            }
        }
        stage('Tag and Push Image') {
            steps {
                sh '''
                docker tag backend:latest 038462784201.dkr.ecr.ap-south-1.amazonaws.com/backend:latest
                docker push 038462784201.dkr.ecr.ap-south-1.amazonaws.com/backend:latest
                '''
            }
        }
        stage('Create EKS Cluster') {
            steps {
                sh '''
                eksctl create cluster --name Devesh --region ap-south-1 --node-type t2.small || echo "Cluster already exists"

                # Wait for cluster readiness
                echo "Waiting for EKS cluster to be active..."
                while ! aws eks describe-cluster --name Devesh --region ap-south-1 --query "cluster.status" --output text | grep -q "ACTIVE"; do
                    echo "Cluster is still creating... waiting..."
                    sleep 30
                done

                # Update kubeconfig after cluster is ready
                aws eks update-kubeconfig --region ap-south-1 --name Devesh
                '''
            }
        }
       stage('Update Kubernetes Secret') {
    steps {
        sh '''
        # Delete the existing secret if it exists
        kubectl delete secret backend-secrets --ignore-not-found

        # Create new Kubernetes secret
        kubectl create secret generic backend-secrets \
          --from-literal=DB_NAME="$DB_NAME" \
          --from-literal=DB_USER="$DB_USER" \
          --from-literal=DB_PASS="$DB_PASS" \
          --from-literal=DB_HOST="$DB_HOST" \
          --from-literal=DB_PORT="$DB_PORT" \
          --from-literal=JWT_SECRET="$JWT_SECRET" \
          --from-literal=PORT="$PORT" \
          --from-literal=LOCATION="$LOCATION"

        # Ensure kubectl apply does not attempt a patch
        kubectl label secret backend-secrets app=backend --overwrite
        '''
    }
}

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    def deploymentDir = 'deployment'  

                    if (fileExists(deploymentDir)) {
                        sh '''
                        cd deployment

                        # Apply all Kubernetes manifests
                        kubectl apply -f .

                        # Wait for Load Balancer to be ready
                        echo "Checking Load Balancer status..."
                        while true; do
                            LB_DNS=$(kubectl get svc backend-service -o jsonpath='{.status.loadBalancer.ingress[*].hostname}')
                            echo "Current Load Balancer DNS: $LB_DNS"

                            if [[ -n "$LB_DNS" ]]; then
                                echo "Load Balancer is ready: $LB_DNS"
                                break
                            fi

                            echo "Waiting for external Load Balancer..."
                            sleep 10
                        done

                        # Verify Load Balancer DNS before proceeding
                        if [[ -z "$LB_DNS" ]]; then
                            echo "Error: Load Balancer DNS not found!"
                            exit 1
                        fi

                        # Initialize and apply Terraform
                        terraform init
                        terraform apply -var="backend_lb_dns=$LB_DNS" -auto-approve
                        '''
                    } else {
                        error "Deployment directory '${deploymentDir}' not found. Check your repository."
                    }
                }
            }
        }
    }
}
