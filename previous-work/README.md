# Introduction of my previous work
## Project Goal
1. Generate a static HTML page to demonstrage my previous works. The HTML page should have similar design components as Anthropic.com. 
2. With some toggle, button animations. 
3. For some demonstration purpose pictures, you need to generate the diagram for me, with Anthropic design patten as well as with your understanding of my project ideas. Put the media into assets.
4. I may copy the web to other computer to demonstrate, so make it only depends on stuff under this project folder.

## Your tasks:
1. I just draft my projects below, you should rewrite it using professional languages. Making each project has same format of description.
2. Design the image assets to help people understanding.
3. Design the website.

## My projects
### VLM related
The model is served on Meta's smart glass to enable the model answer user image related queries in high fidelity and concise manner.
Project 1: Very large scale image/video annotation pipeline
scale: thousands V100 + A100 gpu cards concurrent inference. High concurrent data loading and writing. Billions image swept per day. 
source: large scale internal dataset (1P) + web dataset (3P)
step1: quality filtering: based on resolution, image quality, image aesthetic, video temporal difference, etc.
step2: image face bluring (Privacy requirement at that time)
step3: image/video and caption similarity
step4: image/video classification
step5: NER extraction from original caption
step6: Object detection from image
step7: re-caption the image/video
step8: caption quality evaluation

Project 2: 70b VLM pretraining: classic llava style VLM (2024)
step1: Vision Encoder pretraining: use the curated image-caption dataset and prograssively scale up resolution
step2: Aligner pretraining

### LLama4 full-duplex speech model
Project 1: Speech steerability
Goal: 
1. enable the model can speak like a pirate, mad_scientist, valley_girl, etc 20+ personas. 
2. use voice to control the model's persona
Approach:
Adding this kind of capability to a normal speech model requires a lot effort on posttraining data design. 
data patterns:
Text design:
1 normal conversations
2 rewrite to mad_scientist persona responses
3 steer from Normal persona to MadScientist persona instruction
4 steer from MadScientist to ValleyGirl persona instruction
5 steer from ValleyGirl to Normal persona instruction
Speech design:
record human voice actor's voices. 
TTS above text, voice clone, and pay attention that user and assistant may have different persona in the whole session. 

Project 2: Realtime barge-in (user interrupt assistant) capability
Goal: make the user interrupt assistant behavior more natural.
Data design:
1. construct normal conversations
2. find a breakpoint (t) in assistant turn (this part is tricky and a lot ablation study conducted)
3. overlap the user turn on top of the assistant turn
4. find a cutoff point (t + 0.1~1s) and discard the remaining assistant turn audios
With this data design, the llama4 full-duplex has a really natural barge-in behavior



### Avocado speech model
Project 1: Multilingual Avocado ASR pretrain data curation
Goal: train an in-houase ASR model on priority 40+ languages to do ASR, written form output.
Very Large scale pretraining data curation pipeline:
Peak 10k gpus cards run in parallel, 200M hours+
step1: VAD
step2: LID detection. Some ablations done in language code swith within one segment. For example, people like to mix Hindi and English together.
step3: ASR (most heavy work), different language suit different ASR models, for example, Qwen3Omni model performs bad on Indic languages. Some inference infra techniques developped to accelerate the inference speed. Eg. order and pack the audio segments by their length to reduce wasted PAD token in batch inference. Enable local/remote vllm serving to maximize the GPU utilization. Enable model to run on Blackwell GPUs (Nvidia B200 series GPUs have different cpu architecture compared with H100/A100, the huggingface models need special adaptation)
step4: Multilingual Alignment
step5: Diarization

Project 2: Multilingual Avocado dubbing posttrain and data curation
Goal: train an offline speech+text to speech translation model, supports 20+ priority languages. 
Data:
Step1: audio speech portion detection, audio quality filtering
Step2: VAD
Step3: LID 
Step4: ASR [heavy]
Step5: text to text translation to other 20+ languages [heavy]
Step6: Alignment
Step7: Diarization

posttrain:
user prompt: [audio tokens] This is the transcription of the speech: Good Morning. Translate the English speech to Japanese
assistant response: Transcription: Good Morning. Translation: O Ha Yo. Interleaved text_vq tokens: O <vq0> Ha Yo <vq1>
<vq0>, <vq1> are discrete speech tokens that can be reconstructed into waveform. 

use GRPO to enforce the model in the following dimension:
1. response format
2. I/O duration match
3. I/O transcription match
4. I transcription text and O translation text match, use metricX model to judge
5. I speaker sounds similar to O speaker
6. No accent. ie. Japanese style spoken English is bad
Output. Can achieve relative good performance on several directions. Suprisingly it learns singing.
