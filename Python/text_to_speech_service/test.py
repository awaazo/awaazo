from huggingface_hub import snapshot_download

REPO_ID = "Awaazo/Speakers"

snapshot_download(repo_id=REPO_ID,  local_dir="../ServerFiles/Speakers")

