import sys, json, numpy as np
from scipy.signal import butter, sosfilt
from scipy.io import wavfile
m=json.load(open(sys.argv[1])); out=sys.argv[2]
SR=44100; BPM=96; B=60/BPM; DUR=m['dur']+.6; N=int(DUR*SR); L=np.zeros(N); R=np.zeros(N); rng=np.random.default_rng(7)
def f(x,k,fr): return sosfilt(butter(2,fr,k,fs=SR,output='sos'),x)
def tt(d): return np.arange(int(d*SR))/SR
def put(s,t,g=1.,pan=0.):
    i=int(t*SR)
    if i>=N or i<0: return
    s=s[:N-i]*g; L[i:i+len(s)]+=s*(1-max(0,pan)); R[i:i+len(s)]+=s*(1+min(0,pan))
def tick(): t=tt(.03); return f(rng.standard_normal(len(t)),'highpass',6000)*np.exp(-t/.004)*.12
def tock(): t=tt(.06); return np.sin(2*np.pi*1100*t)*np.exp(-t/.012)*.12
def kick(): t=tt(.3); return np.sin(2*np.pi*np.cumsum(45+90*np.exp(-t/.03))/SR)*np.exp(-t/.15)*.55
def snap(): t=tt(.12); return f(rng.standard_normal(len(t)),'bandpass',[1500,6000])*np.exp(-t/.025)*.2
def mallet(fr): t=tt(.8); return (np.sin(2*np.pi*fr*t)+.3*np.sin(2*np.pi*fr*4*t)*np.exp(-t/.05))*np.exp(-t/.25)*.08
def sub(fr): t=tt(.9); return np.sin(2*np.pi*fr*t)*np.minimum(1,t/.01)*np.exp(-t/.5)*.3
prog=[(110,[440,523.3,659.3]),(87.3,[349.2,440,523.3]),(130.8,[392,523.3,659.3]),(98,[392,493.9,587.3])]
mel=[0,1,2,1,0,2,1,2]
bars=int(DUR/(4*B))+1
for b in range(bars):
    b0=b*4*B; r,ch=prog[b%4]
    for e in range(8): put(tick() if e%2 else tock(),b0+e*B/2,1,.3 if e%2 else -.3)
    if b>=1:
        put(kick(),b0); put(kick(),b0+2.5*B,.7); put(snap(),b0+B); put(snap(),b0+3*B)
        put(sub(r),b0); put(sub(r),b0+2*B)
    for k,i in enumerate(mel): put(mallet(ch[i]*(2 if k%4==3 else 1)),b0+k*B/2,.9,(i-1)*.3)
def verb(x):
    y=x.copy()
    for d,g in ((1601,.25),(2003,.22),(2399,.19)):
        z=np.zeros_like(x); z[d:]=x[:-d]*g; y+=f(z,'lowpass',4000)
    return y
L=verb(L); R=verb(R)
def hit(): t=tt(.4); return f(rng.standard_normal(len(t)),'bandpass',[300,5000])*np.exp(-t/.06)*.35
def pop(): t=tt(.08); return np.sin(2*np.pi*np.cumsum(500+900*np.exp(-t/.01))/SR)*np.exp(-t/.03)*.2
def swish(): t=tt(.35); x=f(rng.standard_normal(len(t)),'bandpass',[900,7000]); return x*np.sin(np.pi*t/.35)**2*.2
def check():
    o=np.zeros(int(.4*SR))
    for k,fr in enumerate((1318.5,1975.5)):
        t=tt(.25); s=np.sin(2*np.pi*fr*t)*np.exp(-t/.08)*.12; i=int(k*.07*SR); o[i:i+len(s)]+=s
    return o
FX=dict(hit=hit,pop=pop,swish=swish,check=check)
for e in m['sfx']:
    s=FX.get(e['type'],pop)(); i=int(e['t']*SR)
    if 0<=i<N: L[i:i+len(s)]+=s[:N-i]; R[i:i+len(s)]+=s[:N-i]
mix=np.stack([L,R],1); mix=np.tanh(mix/np.max(np.abs(mix))*1.15)
fd=int(1.2*SR); mix[-fd:]*=np.linspace(1,0,fd)[:,None]; mix/=np.max(np.abs(mix))/.89
wavfile.write(out,SR,(mix*32767).astype(np.int16)); print('ok',DUR)
