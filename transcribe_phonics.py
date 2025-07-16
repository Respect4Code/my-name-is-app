
import whisper
import os

def transcribe_audio(audio_file_path):
    """Transcribe audio file using Whisper"""
    # Load the Whisper model (base is good for phonics)
    print("Loading Whisper model...")
    model = whisper.load_model("base")
    
    # Transcribe the audio
    print(f"Transcribing {audio_file_path}...")
    result = model.transcribe(audio_file_path)
    
    # Print the full result
    print("\n" + "="*50)
    print("TRANSCRIPTION RESULT:")
    print("="*50)
    print(f"Text: {result['text']}")
    print("\n" + "="*50)
    print("DETAILED SEGMENTS:")
    print("="*50)
    
    for i, segment in enumerate(result['segments']):
        start_time = segment['start']
        end_time = segment['end']
        text = segment['text']
        print(f"Segment {i+1}: [{start_time:.2f}s - {end_time:.2f}s] {text}")
    
    return result

if __name__ == "__main__":
    # Your audio file path
    audio_file = "attached_assets/phonics 1 669_1752702446474.m4a"
    
    if os.path.exists(audio_file):
        result = transcribe_audio(audio_file)
        
        # Save transcription to file
        with open("phonics_transcription.txt", "w") as f:
            f.write("PHONICS AUDIO TRANSCRIPTION\n")
            f.write("=" * 40 + "\n\n")
            f.write(f"Full text: {result['text']}\n\n")
            f.write("Detailed segments:\n")
            for i, segment in enumerate(result['segments']):
                f.write(f"Segment {i+1}: [{segment['start']:.2f}s - {segment['end']:.2f}s] {segment['text']}\n")
        
        print(f"\nTranscription saved to 'phonics_transcription.txt'")
    else:
        print(f"Audio file not found: {audio_file}")
        print("Available files in attached_assets:")
        if os.path.exists("attached_assets"):
            for file in os.listdir("attached_assets"):
                print(f"  - {file}")
