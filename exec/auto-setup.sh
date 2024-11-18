#!/bin/bash

echo "#############################################"
echo "########### TTUBEOT Setup Script ############"
echo "#############################################"

if [ "$EUID" -ne 0 ]
  then echo "Please run as root"
  exit
fi

cd ../../
PWD=$(pwd)

echo "Do you want to resume from a specific step? (Y/n)"
read -r resume
if [ -z "$resume" ] || [[ "$resume" =~ ^[Yy]$ ]]; then
  echo "Enter the step number to resume from:"
  echo "1. Install k3s"
  echo "2. Install Redis Cluster and RabbitMQ"
  echo "3. Build the backend image with Dockerfile and deploy"
  read -r step
  if ! [[ "$step" =~ ^[1-3]+$ ]]; then
    echo "Please enter a valid step number"
    exit 1
  fi
else
  step=1
fi

if [ "$step" -le 1 ]; then
  echo "#############################################"
  echo "#########           Step 1          #########"
  echo "#############################################"
  echo "Install K3S"
  if ! command -v k3s &> /dev/null; then
    curl -sfL https://get.k3s.io | sh -
    systemctl enable k3s
  fi

  echo "Step 1: Done"
fi

if [ "$step" -le 2 ]; then
  echo "#############################################"
  echo "#########           Step 2          #########"
  echo "#############################################"
  echo "Install Redis Cluster and RabbitMQ"

  helm install redis-cluster bitnami/redis-cluster --namespace ttubeot-adventure --set architecture=replication --set cluster.nodes=3 --set cluster.replicas=2

  helm install rabbitmq bitnami/rabbitmq --namespace ttubeot-adventure

  echo "Step 2: Done"
fi

if [ "$step" -le 3 ]; then
  echo "#############################################"
  echo "#########           Step 3          #########"
  echo "#############################################"
  echo "Build the backend image with Dockerfile and deploy"

  cd $PWD/S11P31E101/server

  kubectl create namespace ttubeot-adventure
  kubectl create namespace ttubeot-user

  for dir in */; do
    cd $dir
    if [ -f "Dockerfile" ]; then
      docker build -t ssafy-final-$dir .
      
      if [ -d "k8s" ]; then
        cd k8s
        for file in *.yaml; do
          kubectl apply -f $file
        done
      fi
    fi
    cd ../
  done

  cd ../../

  echo "Step 3: Done"
fi

echo "#############################################"
echo "#########   TTUBEOT Setup Script    #########"
echo "#########          Finished         #########"
echo "#############################################"
