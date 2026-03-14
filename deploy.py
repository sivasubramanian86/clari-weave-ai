import subprocess
import sys
import os

PROJECT_ID = "clariweaveai"
REGION = "us-central1"
SERVICE_NAME = "clariweave-agent"
IMAGE_NAME = f"gcr.io/{PROJECT_ID}/{SERVICE_NAME}"

def run_command(command, description):
    print(f"\n[RUNNING] {description}...")
    try:
        # shell=True is used to support git-bash/powershell environments sometimes found on Windows
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"[SUCCESS] {description}")
        return result.stdout
    except subprocess.CalledProcessError as e:
        print(f"[FAILED] {description}")
        print(f"Error: {e.stderr}")
        sys.exit(1)

def deploy():
    # 1. Ensure gcloud is pointing to the right project
    run_command(f"gcloud config set project {PROJECT_ID}", "Setting GCP Project")

    # 2. Build the image using Cloud Builds
    # This is better for hackathons as it doesn't require local Docker
    print(f"\n[BUILDING] Submitting build to Google Cloud Build (Project: {PROJECT_ID})...")
    # Using --ignore-file to ensure we don't upload venv/node_modules
    run_command(f"gcloud builds submit --tag {IMAGE_NAME} .", "Building Container Image")

    # 3. Deploy to Cloud Run
    print(f"\n[DEPLOYING] Deploying to Cloud Run in {REGION}...")
    run_command(
        f"gcloud run deploy {SERVICE_NAME} "
        f"--image {IMAGE_NAME} "
        f"--platform managed "
        f"--region {REGION} "
        f"--allow-unauthenticated "
        f"--port 8080 "
        f"--timeout 3600 "
        f"--set-env-vars=\"GEMINI_API_KEY=PLACEHOLDER_OR_GET_FROM_SECRET\"",
        "Deploying to Cloud Run"
    )

    print("\n" + "="*50)
    print("🚀 CLARE IS NOW IN THE CLOUD!")
    print(f"Service URL: Visit your GCP Console for the Cloud Run URL.")
    print("="*50)
    print("\nNOTE: Remember to set your GEMINI_API_KEY in the Cloud Run Console secrets!")

if __name__ == "__main__":
    deploy()
