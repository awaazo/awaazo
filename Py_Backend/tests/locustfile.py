from locust import HttpUser, task, between

class WebsiteUser(HttpUser):
    wait_time = between(1, 2.5)

    @task
    def generate_audio(self):
        self.client.post("/tts/generate", json={
            "speaker": "speaker1",
            "text": "Hello, world!",
            "pitch_change": 0,
            "index_rate": 0,
            "language": "en"
        })