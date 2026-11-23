# usage: music_trio.py meta.json out.wav genre   (amapiano | dembow | pianohouse)
import sys, json, numpy as np
from scipy.signal import butter, sosfilt
from scipy.io import wavfile
m=json.load(open(sys.argv[1])); out=sys.argv[2]; G=sys.argv[3]
BPM={'amapiano':112,'dembow':96,'pianohouse':122}[G]
SR=44100; B=60/BPM; DUR=m['dur']+.6; N=int(DUR*SR); L=np.zeros(N); R=np.zeros(N); rng=np.random.default_rng(len(G))
def f(x,k,fr): return sosfilt(butter(2,fr,k,fs=SR,output='sos'),x)
def tt(d): return np.arange(int(d*SR))/SR
def put(s,t,g=1.,pan=0.):
    i=int(t*SR)
    if i>=N or i<0: return
    s=s[:N-i]*g; L[i:i+len(s)]+=s*(1-max(0,pan)); R[i:i+len(s)]+=s*(1+min(0,pan))
def kick(dec=.15): t=tt(.35); return np.sin(2*np.pi*np.cumsum(48+110*np.exp(-t/.025))/SR)*np.exp(-t/dec)*.7
def snare(): t=tt(.2); return (f(rng.standard_normal(len(t)),'bandpass',[1200,7000])*np.exp(-t/.06)+np.sin(2*np.pi*190*t)*np.exp(-t/.03)*.6)*.24
def clap(): t=tt(.2); n=f(rng.standard_normal(len(t)),'bandpass',[900,4000]); return n*np.exp(-t/.05)*.2
def hat(o=False): t=tt(.15 if o else .04); return f(rng.standard_normal(len(t)),'highpass',8500)*np.exp(-t/(.05 if o else .008))*.09
def shaker(): t=tt(.07); return f(rng.standard_normal(len(t)),'bandpass',[5000,11000])*np.sin(np.pi*t/.07)**2*.05
def logdrum(fr): t=tt(.5); x=np.sin(2*np.pi*np.cumsum(fr*(1+.6*np.exp(-t/.03)))/SR); return np.tanh(2*x)*np.exp(-t/.22)*.38
def sub(fr,d): t=tt(d); return np.sin(2*np.pi*fr*t)*np.minimum(1,t/.004)*np.exp(-t/.3)*.42
def piano(fr,d=.6):
    t=tt(d); x=sum(np.sin(2*np.pi*fr*k*t)*np.exp(-t*(2+k*1.5))/k for k in (1,2,3,4)); return x*np.minimum(1,t/.003)*.06
def pad(ch,d): t=tt(d); x=sum(np.sin(2*np.pi*fr*t)+.3*np.sin(2*np.pi*fr*1.004*t) for fr in ch); return f(x,'lowpass',1500)*np.minimum(1,t/.4)*np.exp(-t/4)*.035
progs={'amapiano':[([293.7,349.2,440,523.3],73.4),([261.6,329.6,392,493.9],65.4),([246.9,293.7,370,440],61.7),([261.6,329.6,392,493.9],65.4)],
 'dembow':[([220,261.6,329.6],55),([174.6,220,261.6],43.7),([196,246.9,293.7],49),([164.8,196,246.9],41.2)],
 'pianohouse':[([261.6,329.6,392,493.9],65.4),([220,261.6,329.6,392],55),([174.6,220,261.6,329.6],43.7),([196,246.9,293.7,349.2],49)]}[G]
bars=int(DUR/(4*B))+1
for b in range(bars):
    b0=b*4*B; ch,r=progs[b%4]
    if G=='amapiano':
        for k in range(4): put(kick(.12),b0+k*B,.8)
        put(clap(),b0+B); put(clap(),b0+3*B)
        for e in range(16): put(shaker(),b0+e*B/4,1 if e%2 else .5,-.3)
        for bt in (.75,1.5,2.75,3.5): put(logdrum(r*(2 if bt in (1.5,3.5) else 1)),b0+bt*B)
        put(pad(ch,4*B+.5),b0,1,.1)
        for bt in (0,1.5,3): put(piano(ch[-1]*2,.5),b0+bt*B,1,.3)
    elif G=='dembow':
        for bt in (0,2): put(kick(.18),b0+bt*B)
        for bt in (.75,1.5,2.75,3.5): put(snare(),b0+bt*B,1,.05)
        for e in range(8): put(hat(),b0+e*B/2,1,-.3)
        put(sub(r*2,1.2),b0); put(sub(r*2,1.2),b0+2*B)
        for k,fr in enumerate(ch):
            for bt in (0,.75,2,2.75): put(piano(fr*2,.35)*1.2,b0+bt*B,1,(k-1)*.2)
    else:
        for k in range(4): put(kick(.14),b0+k*B)
        put(clap(),b0+B); put(clap(),b0+3*B)
        for e in range(4): put(hat(True),b0+e*B+B/2,1,-.3)
        for e in range(16): put(hat(),b0+e*B/4,.5,.3)
        for bt in (.5,1.5,2.5,3.5): put(sub(r*2,.35),b0+bt*B)
        for bt in (0,.75,1.5,2.5,3.25):
            for k,fr in enumerate(ch): put(piano(fr*2,.5),b0+bt*B,1,(k-1.5)*.2)
def verb(x):
    y=x.copy()
    for d,g in ((1427,.22),(1783,.2),(2141,.17)):
        z=np.zeros_like(x); z[d:]=x[:-d]*g; y+=f(z,'lowpass',4500)
    return y
L=verb(L); R=verb(R)
def hit(): t=tt(.5); return (np.sin(2*np.pi*np.cumsum(40+160*np.exp(-t/.03))/SR)*np.exp(-t/.2)+f(rng.standard_normal(len(t)),'bandpass',[200,6000])*np.exp(-t/.08)*.6)*.45
def pop(): t=tt(.1); return np.sin(2*np.pi*np.cumsum(400+1100*np.exp(-t/.012))/SR)*np.exp(-t/.035)*.26
def swish(): t=tt(.35); x=f(rng.standard_normal(len(t)),'bandpass',[900,7000]); return x*np.sin(np.pi*t/.35)**2*.22
def check():
    o=np.zeros(int(.3*SR))
    for k,fr in enumerate((1318.5,1975.5)):
        t=tt(.2); s=np.sin(2*np.pi*fr*t)*np.exp(-t/.06)*.11; i=int(k*.06*SR); o[i:i+len(s)]+=s
    return o
FX=dict(hit=hit,pop=pop,swish=swish,check=check)
for e in m['sfx']:
    s=FX.get(e['type'],pop)(); i=int(e['t']*SR)
    if 0<=i<N: L[i:i+len(s)]+=s[:N-i]; R[i:i+len(s)]+=s[:N-i]
mix=np.stack([L,R],1); mix=np.tanh(mix/np.max(np.abs(mix))*1.2)
fd=int(1.2*SR); mix[-fd:]*=np.linspace(1,0,fd)[:,None]; mix/=np.max(np.abs(mix))/.89
wavfile.write(out,SR,(mix*32767).astype(np.int16)); print('ok',G,DUR)
