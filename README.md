<img src="https://avatars2.githubusercontent.com/u/2810941?v=3&s=96" alt="Google Cloud Platform logo" title="Google Cloud Platform" align="right" height="96" width="96"/>

# Google Cloud Functions - Cloud Storage - Workspace API
Sync Data from Workspace API to Cloud Storage using Google Cloud Functions

## Deploy the function
1. Set functions region
```
gcloud config set region <REGION>
``` 
Replace `<REGION>` with your desired region. e.g., us-east1

2. Deploy your function
```
gcloud functions deploy sync-olpc-devices --gen2 --runtime nodejs16 --trigger-http --timeout=10s --trigger-service-account=gserviceacc@school-app-tracker.iam.gserviceaccount.com --ingress-settings=internal-only --allow-unauthenticated
```
[Reference](https://cloud.google.com/sdk/gcloud/reference/functions/deploy)