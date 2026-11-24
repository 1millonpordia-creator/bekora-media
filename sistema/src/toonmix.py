import sys,json,subprocess
ID,mus=sys.argv[1],sys.argv[2]
import os
S=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.makedirs(S+'/out/TOON',exist_ok=True);os.makedirs(S+'/out/PV',exist_ok=True)
subprocess.run(['python3',f'{S}/src/meta.py',f'{S}/build/toon.html',f'es-{ID}',f'{S}/meta_pv{ID}.json'],check=True)
subprocess.run(['python3',f'{S}/src/{mus}',f'{S}/meta_pv{ID}.json',f'{S}/music_pv{ID}.wav'],check=True)
durs=[float(x) for x in open(f'{S}/build/durs.js').read().split(f"['{ID}']=")[1].split(']')[0].strip('[').split(',')]
t=0;ins=[];flt=[]
for i,d in enumerate(durs):
    ins+=['-i',f'{S}/vo/{ID}/seg{i}.wav'];flt.append(f'[{i}:a]adelay={int((t+.18)*1000)}|{int((t+.18)*1000)}[v{i}]');t+=d
n=len(durs);flt.append(''.join(f'[v{i}]' for i in range(n))+f'amix=inputs={n}:normalize=0,apad=pad_dur=2[vo]')
subprocess.run(['ffmpeg','-loglevel','error','-y',*ins,'-filter_complex',';'.join(flt),'-map','[vo]','-ac','2','-t',str(t+.8),f'{S}/vo/{ID}/vo.wav'],check=True)
o=f'{S}/out/TOON/{ID}'
for l in ('es','ca'):
    subprocess.run(['python3',f'{S}/src/render.py',f'{S}/build/toon.html',f'{l}-{ID}',f'{o}-raw-{l}.mp4'],check=True,capture_output=True)
# IG (ca): music only
subprocess.run(['ffmpeg','-loglevel','error','-y','-i',f'{o}-raw-ca.mp4','-i',f'{S}/music_pv{ID}.wav','-c:v','copy','-c:a','aac','-b:a','192k','-shortest',f'{o}-ca.mp4'],check=True)
# TikTok (es): voice + ducked music
fc='[1:a]volume=0.55[m];[2:a]asplit=2[vo][sc];[m][sc]sidechaincompress=threshold=0.03:ratio=8:attack=20:release=300[md];[md][vo]amix=inputs=2:normalize=0:weights=1 1.6,loudnorm=I=-14:TP=-1.5:LRA=11[a]'
subprocess.run(['ffmpeg','-loglevel','error','-y','-i',f'{o}-raw-es.mp4','-i',f'{S}/music_pv{ID}.wav','-i',f'{S}/vo/{ID}/vo.wav','-filter_complex',fc,'-map','0:v','-map','[a]','-c:v','copy','-c:a','aac','-b:a','192k','-shortest',f'{o}-es.mp4'],check=True)
print('ok',ID,t)
