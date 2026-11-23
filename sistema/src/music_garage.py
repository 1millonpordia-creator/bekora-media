import sys, json, numpy as np
from scipy.signal import butter, sosfilt
from scipy.io import wavfile
m=json.load(open(sys.argv[1])); out=sys.argv[2]
SR=44100; BPM=132; B=60/BPM; DUR=m['dur']+.6; N=int(DUR*SR); L=np.zeros(N); R=np.zeros(N); rng=np.random.default_rng(21)
def f(x,k,fr): return sosfilt(butter(2,fr,k,fs=SR,output='sos'),x)
def tt(d): return np.arange(int(d*SR))/SR
def put(s,t,g=1.,pan=0.):
    i=int(t*SR)
    if i>=N or i<0: return
    s=s[:N-i]*g; L[i:i+len(s)]+=s*(1-max(0,pan)); R[i:i+len(s)]+=s*(1+min(0,pan))
def kick(): t=tt(.3); return np.sin(2*np.pi*np.cumsum(48+110*np.exp(-t/.025))/SR)*np.exp(-t/.13)*.75
def snare(): t=tt(.2); return (f(rng.standard_normal(len(t)),'bandpass',[1500,7000])*np.exp(-t/.05)+np.sin(2*np.pi*200*t)*np.exp(-t/.03)*.6)*.25
def hat(): t=tt(.04); return f(rng.standard_normal(len(t)),'highpass',9000)*np.exp(-t/.008)*.1
def rim(): t=tt(.05); return np.sin(2*np.pi*1700*t)*np.exp(-t/.008)*.12
def sub(fr,d): t=tt(d); return np.sin(2*np.pi*fr*t)*np.minimum(1,t/.004)*np.exp(-t/.35)*.45
def stab(ch,d=.22):
    t=tt(d); x=sum(np.sign(np.sin(2*np.pi*fr*t+k))*.5+np.sin(2*np.pi*fr*1.005*t) for k,fr in enumerate(ch))
    return f(x,'lowpass',2600)*np.exp(-t/.07)*.05
prog=[([349.2,415.3,523.3],87.3),([311.1,392,466.2],77.8),([277.2,349.2,415.3],69.3),([311.1,392,466.2],77.8)]  # Fm Eb Db Eb
bars=int(DUR/(4*B))+1
for b in range(bars):
    b0=b*4*B; ch,r=prog[b%4]
    # 2-step kick: 1, 2.75 (skippy)
    for bt in (0,1.75,2.5): put(kick(),b0+bt*B,1 if bt==0 else .8)
    put(snare(),b0+B,1,.05); put(snare(),b0+3*B,1,.05)
    for e in range(8): put(hat(),b0+e*B/2+B/4,1,-.3)
    for bt in (.75,2.25,3.5): put(rim(),b0+bt*B,1,.3)
    for bt,d in ((0,.6),(1.75,.3),(2.5,.6),(3.5,.4)): put(sub(r*(2 if bt==3.5 else 1),d),b0+bt*B)
    for bt in (.5,1.5,2.75,3.25): put(stab(ch),b0+bt*B,1,.15*np.sin(bt*3))
def verb(x):
    y=x.copy()
    for d,g in ((1381,.18),(1667,.16)):
        z=np.zeros_like(x); z[d:]=x[:-d]*g; y+=f(z,'lowpass',5000)
    return y
L=verb(L); R=verb(R)
def hit(): t=tt(.5); return (np.sin(2*np.pi*np.cumsum(40+160*np.exp(-t/.03))/SR)*np.exp(-t/.2)+f(rng.standard_normal(len(t)),'bandpass',[200,6000])*np.exp(-t/.08)*.6)*.5
def pop(): t=tt(.1); return np.sin(2*np.pi*np.cumsum(400+1200*np.exp(-t/.012))/SR)*np.exp(-t/.035)*.3
def swish(): t=tt(.35); x=f(rng.standard_normal(len(t)),'bandpass',[900,7000]); return x*np.sin(np.pi*t/.35)**2*.25
def check():
    o=np.zeros(int(.3*SR))
    for k,fr in enumerate((1318.5,1975.5)):
        t=tt(.2); s=np.sin(2*np.pi*fr*t)*np.exp(-t/.06)*.12; i=int(k*.06*SR); o[i:i+len(s)]+=s
    return o
def tick(): t=tt(.04); return np.sin(2*np.pi*2600*t)*np.exp(-t/.007)*.2
def drop(): t=tt(1.0); return np.sin(2*np.pi*np.cumsum(30+200*np.exp(-t/.08))/SR)*np.exp(-t/.5)*.6
FX=dict(hit=hit,pop=pop,swish=swish,check=check,tick=tick,drop=drop)
for e in m['sfx']:
    s=FX.get(e['type'],pop)(); i=int(e['t']*SR)
    if 0<=i<N: L[i:i+len(s)]+=s[:N-i]; R[i:i+len(s)]+=s[:N-i]
mix=np.stack([L,R],1); mix=np.tanh(mix/np.max(np.abs(mix))*1.25)
fd=int(1.0*SR); mix[-fd:]*=np.linspace(1,0,fd)[:,None]; mix/=np.max(np.abs(mix))/.89
wavfile.write(out,SR,(mix*32767).astype(np.int16)); print('ok',DUR)
