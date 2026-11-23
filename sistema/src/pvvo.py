# usage: pvvo.py id  -> vo/<id>/seg*.wav, build/durs.js update, vo/<id>/vo.wav
import sys,json,subprocess,re,os,wave
ID=sys.argv[1]; B='build'; D=f'vo/{ID}'; os.makedirs(D,exist_ok=True)
cfg=subprocess.run(['node','-e',f"global.window={{}};require('./{B}/cfg.js');console.log(JSON.stringify(window.CFG['{ID}']))"],capture_output=True,text=True).stdout
C=json.loads(cfg)
M='tts/tts_models--es--css10--vits'
from TTS.api import TTS
tts=TTS(model_path=f'{M}/model_file.pth.tar',config_path=f'{M}/config.json')
durs=[]
for i,s in enumerate(C['seg']):
    t=s['cap']['es']
    t=t.replace('NFC','ene efe ce').replace('QR','cu erre').replace('bekora punto es','békora punto es').replace('Bekora','Békora')
    raw=f'{D}/raw{i}.wav'; out=f'{D}/seg{i}.wav'
    tts.tts_to_file(text=t,file_path=raw)
    subprocess.run(['ffmpeg','-loglevel','error','-y','-i',raw,'-af','silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,atempo=1.07,highpass=f=90,equalizer=f=3000:t=q:w=1:g=3,acompressor=threshold=-18dB:ratio=3:attack=5:release=80,aresample=44100','-ac','1',out])
    w=wave.open(out); d=w.getnframes()/w.getframerate(); w.close()
    durs.append(round(d+0.55,3))
p=f'{B}/durs.js'; old=open(p).read() if os.path.exists(p) else 'window.DURS={};'
old+=f"\nwindow.DURS['{ID}']={json.dumps(durs)};"
open(p,'w').write(old); print(ID,durs,sum(durs))
