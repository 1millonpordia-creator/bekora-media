import sys, json, numpy as np
from scipy.signal import butter, sosfilt
from scipy.io import wavfile
m=json.load(open(sys.argv[1])); out=sys.argv[2]
SR=44100; BPM=100; B=60/BPM; DUR=m['dur']+.6; N=int(DUR*SR); L=np.zeros(N); R=np.zeros(N); rng=np.random.default_rng(13)
def f(x,k,fr): return sosfilt(butter(2,fr,k,fs=SR,output='sos'),x)
def tt(d): return np.arange(int(d*SR))/SR
def put(s,t,g=1.,pan=0.):
    i=int(t*SR)
    if i>=N or i<0: return
    s=s[:N-i]*g; L[i:i+len(s)]+=s*(1-max(0,pan)); R[i:i+len(s)]+=s*(1+min(0,pan))
def nylon(fr,d=.9):
    # Karplus-Strong
    n=int(SR/fr); buf=rng.uniform(-1,1,n); o=np.zeros(int(d*SR))
    for i in range(len(o)):
        o[i]=buf[i%n]; buf[i%n]=.5*(buf[i%n]+buf[(i+1)%n])*.996
    return f(o,'lowpass',3500)*.12
cache={}
def ny(fr):
    k=round(fr,1)
    if k not in cache: cache[k]=nylon(fr)
    return cache[k]
def bass(fr): t=tt(.6); return np.sin(2*np.pi*fr*t)*np.minimum(1,t/.01)*np.exp(-t/.4)*.32
def rim(): t=tt(.05); return (np.sin(2*np.pi*1900*t)+f(rng.standard_normal(len(t)),'bandpass',[2000,6000])*.5)*np.exp(-t/.007)*.13
def shk(): t=tt(.08); return f(rng.standard_normal(len(t)),'bandpass',[5000,11000])*np.sin(np.pi*t/.08)**2*.05
prog=[(98,[246.9,293.7,370,440]),(110,[261.6,329.6,392,493.9]),(123.5,[246.9,293.7,370,440]),(82.4,[246.9,311.1,392,466.2])]  # Gmaj9 Am9 Bm7 E7#9-ish
bossa=[0,.75,1.5,2.5,3.25]  # comping
bars=int(DUR/(4*B))+1
for b in range(bars):
    b0=b*4*B; r,ch=prog[b%4]
    put(bass(r),b0); put(bass(r*1.5),b0+1.5*B,.8); put(bass(r),b0+2*B); put(bass(r*1.5),b0+3.5*B,.8)
    for bt in bossa:
        for k,fr in enumerate(ch): put(ny(fr),b0+bt*B+k*.012,.8,(k-1.5)*.2)
    for bt in (0,1.5,2.5,3.5): put(rim(),b0+bt*B,1,.3)
    for e in range(16): put(shk(),b0+e*B/4,1 if e%2 else .5,-.35)
def verb(x):
    y=x.copy()
    for d,g in ((1777,.28),(2111,.25),(2503,.22)):
        z=np.zeros_like(x); z[d:]=x[:-d]*g; y+=f(z,'lowpass',4000)
    return y
L=verb(L); R=verb(R)
def tock(): t=tt(.08); return np.sin(2*np.pi*900*t)*np.exp(-t/.02)*.25
def pop(): t=tt(.1); return np.sin(2*np.pi*np.cumsum(350+1000*np.exp(-t/.012))/SR)*np.exp(-t/.035)*.28
def slide(): t=tt(.3); x=f(rng.standard_normal(len(t)),'bandpass',[700,5000]); return x*np.sin(np.pi*t/.3)**2*.22
def buzz(): t=tt(.35); return np.sign(np.sin(2*np.pi*120*t))*np.exp(-t/.2)*.07
def whoosh(): t=tt(.9); x=f(rng.standard_normal(len(t)),'bandpass',[300,4000]); return x*(t/.9)**2*np.exp(-np.maximum(0,t-.8)/.05)*.28
def nfc():
    o=np.zeros(int(.5*SR))
    for k,fr in enumerate((1568,2093)):
        t=tt(.35); s=np.sin(2*np.pi*fr*t)*np.exp(-t/.1)*.14; i=int(k*.08*SR); o[i:i+len(s)]+=s
    return o
def ding(): t=tt(.6); return (np.sin(2*np.pi*1760*t)+.4*np.sin(2*np.pi*3520*t))*np.exp(-t/.18)*.09
def chime():
    o=np.zeros(int(1.4*SR))
    for k,fr in enumerate((784,987.8,1174.7,1568)):
        t=tt(1.0); s=np.sin(2*np.pi*fr*t)*np.exp(-t/.35)*.07; i=int(k*.09*SR); o[i:i+len(s)]+=s
    return o
FX=dict(tock=tock,pop=pop,slide=slide,buzz=buzz,whoosh=whoosh,nfc=nfc,ding=ding,chime=chime)
for e in m['sfx']:
    s=FX.get(e['type'],pop)(); i=int(e['t']*SR)
    if 0<=i<N: L[i:i+len(s)]+=s[:N-i]; R[i:i+len(s)]+=s[:N-i]
mix=np.stack([L,R],1); mix=np.tanh(mix/np.max(np.abs(mix))*1.1)
fd=int(1.2*SR); mix[-fd:]*=np.linspace(1,0,fd)[:,None]; mix/=np.max(np.abs(mix))/.89
wavfile.write(out,SR,(mix*32767).astype(np.int16)); print('ok',DUR)
