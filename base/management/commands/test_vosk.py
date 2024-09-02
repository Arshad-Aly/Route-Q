import os
import json
from django.core.management.base import BaseCommand
from django.conf import settings
from vosk import Model, KaldiRecognizer
import wave
from pydub import AudioSegment

class Command(BaseCommand):
    help = 'Test Vosk transcription with a local audio file'

    def add_arguments(self, parser):
        parser.add_argument('audio_file', type=str, help='Path to the audio file')

    def handle(self, *args, **options):
        audio_file = options['audio_file']
        
        if not os.path.exists(audio_file):
            self.stdout.write(self.style.ERROR(f"Audio file not found: {audio_file}"))
            return

        # Convert audio to proper format
        self.stdout.write("Converting audio file...")
        audio = AudioSegment.from_wav(audio_file)
        audio = audio.set_channels(1)  # Convert to mono
        audio = audio.set_frame_rate(16000)  # Set sample rate to 16kHz
        
        temp_audio_file = "temp_converted_audio.wav"
        audio.export(temp_audio_file, format="wav")
        self.stdout.write(self.style.SUCCESS("Audio file converted successfully"))

        model_path = os.path.join(settings.BASE_DIR, 'models', 'vosk-model-en-in-0.5') # vosk-model-en-us-0.22 , vosk-model-small-en-us-0.15
        
        if not os.path.exists(model_path):
            self.stdout.write(self.style.ERROR(f"Vosk model not found: {model_path}"))
            return

        try:
            model = Model(model_path)
            self.stdout.write(self.style.SUCCESS("Vosk model loaded successfully"))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error loading Vosk model: {str(e)}"))
            return

        try:
            with wave.open(temp_audio_file, 'rb') as wf:
                self.stdout.write(self.style.SUCCESS(f"Opened converted audio file"))
                self.stdout.write(f"Audio file properties: channels={wf.getnchannels()}, width={wf.getsampwidth()}, rate={wf.getframerate()}")
                
                rec = KaldiRecognizer(model, wf.getframerate())

                result = []
                while True:
                    data = wf.readframes(4000)
                    if len(data) == 0:
                        break
                    if rec.AcceptWaveform(data):
                        partial_result = json.loads(rec.Result())
                        self.stdout.write(f"Partial result: {partial_result}")
                        result.append(partial_result['text'])

                final_result = json.loads(rec.FinalResult())
                self.stdout.write(f"Final result: {final_result}")
                result.append(final_result['text'])

            transcription = ' '.join(result)
            self.stdout.write(self.style.SUCCESS(f"Final transcription: {transcription}"))

        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error during transcription: {str(e)}"))
        
        finally:
            # Clean up the temporary file
            if os.path.exists(temp_audio_file):
                os.remove(temp_audio_file)