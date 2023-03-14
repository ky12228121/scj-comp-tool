tfinit-dev:
	cd backend/terraform/environments/dev && terraform init -backend-config="./config.s3.tfbackend"

tfplan-dev:
	cd backend/terraform/environments/dev && terraform plan

tfapply-dev:
	cd backend/terraform/environments/dev && terraform apply

tfinit-prod:
	cd backend/terraform/environments/prod && terraform init -backend-config="./config.s3.tfbackend"

tfplan-prod:
	cd backend/terraform/environments/prod && terraform plan

tfapply-prod:
	cd backend/terraform/environments/prod && terraform apply