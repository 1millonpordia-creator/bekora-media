import sys, json, numpy as np
from scipy.signal import butter, sosfilt
from scipy.io import wavfile
m=json.load(open(sys.argv[1])); out=sys.argv[2]
SR=44100; BPM=112; B=60/BPM; DUR=m['dur']+.6; N=int(DUR*SR); L=np.zeros(N); R=np.zeros(N); rng=np.random.default_rng(3)
def f(x,k,fr): return sosfilt(butter(2,fr,k,fs=SR,output='sos'),x)
def tt(d): return np.arange(int(d*SR))/SR
def put(s,t,g=1.,pan=0.):
    i=int(t*SR)
    if i>=N or i<0: return
    s=s[:N-i]*g; L[i:i+len(s)]+=s*(1-max(0,pan)); R[i:i+len(s)]+=s*(1+min(0,pan))
cache={}
def uke(fr):
    k=round(fr,1)
    if k in cache: return cache[k]
    n=int(SR/fr); buf=rng.uniform(-1,1,n); o=np.zeros(int(.7*SR))
    for i in range(len(o)): o[i]=buf[i%n]; buf[i%n]=.5*(buf[i%n]+buf[(i+1)%n])*.993
    cache[k]=f(o,'lowpass',5000)*.1; return cache[k]
def glock(fr): t=tt(.6); return (np.sin(2*np.pi*fr*t)+.3*np.sin(2*np.pi*fr*2.76*t))*np.exp(-t/.18)*.07
def kick(): t=tt(.25); return np.sin(2*np.pi*np.cumsum(55+100*np.exp(-t/.02))/SR)*np.exp(-t/.1)*.5
def clap(): t=tt(.15); return f(rng.standard_normal(len(t)),'bandpass',[1000,5000])*np.exp(-t/.04)*.18
def shk(): t=tt(.06); return f(rng.standard_normal(len(t)),'bandpass',[6000,12000])*np.sin(np.pi*t/.06)**2*.05
def bass(fr): t=tt(.3); return np.sin(2*np.pi*fr*t)*np.exp(-t/.15)*.3
prog=[(98,[392,493.9,587.3]),(130.8,[392,523.3,659.3]),(110,[440,523.3,659.3]),(146.8,[440,587.3,740])]
mel=[784,880,987.8,880,784,659.3,587.3,659.3]
for b in range(int(DUR/(4*B))+1):
    b0=b*4*B; r,ch=prog[b%4]
    for e in range(4): put(kick(),b0+e*B,.8); put(bass(r if e%2==0 else r*1.5),b0+e*B+B/2)
    put(clap(),b0+B); put(clap(),b0+3*B)
    for e in range(8): put(shk(),b0+e*B/2,1,-.3)
    for bt in (0,.5,1.5,2,2.5,3.5):
        for k,fr in enumerate(ch): put(uke(fr),b0+bt*B+k*.015,.9,(k-1)*.25)
    if b%2: 
        for k,fr in enumerate(mel): put(glock(fr),b0+k*B/2,1,.3)
def verb(x):
    y=x.copy()
    for d,g in ((1301,.2),(1709,.17)):
        z=np.zeros_like(x); z[d:]=x[:-d]*g; y+=f(z,'lowpass',5000)
    return y
L=verb(L); R=verb(R)
# SFX
def hit(): t=tt(.4); return f(rng.standard_normal(len(t)),'bandpass',[200,5000])*np.exp(-t/.06)*.35
def pop(): t=tt(.08); return np.sin(2*np.pi*np.cumsum(500+1000*np.exp(-t/.01))/SR)*np.exp(-t/.03)*.22
def swish(): t=tt(.35); x=f(rng.standard_normal(len(t)),'bandpass',[900,7000]); return x*np.sin(np.pi*t/.35)**2*.22
def scratch():
    t=tt(.45); fr=900+700*np.sin(2*np.pi*7*t); x=f(rng.standard_normal(len(t)),'bandpass',[300,4000])*(.6+.4*np.sin(2*np.pi*np.cumsum(fr)/SR))
    return x*np.exp(-t/.25)*.5
def typ():
    o=np.zeros(int(.9*SR))
    for k in range(10):
        t=tt(.025); s=f(rng.standard_normal(len(t)),'bandpass',[2000,7000])*np.exp(-t/.004)*.25; i=int(k*.08*SR); o[i:i+len(s)]+=s
    return o
def buzz(): t=tt(.4); return np.sign(np.sin(2*np.pi*110*t))*np.exp(-t/.2)*.08
def steps():
    o=np.zeros(int(1.6*SR))
    for k in range(6):
        t=tt(.08); s=f(rng.standard_normal(len(t)),'lowpass',900)*np.exp(-t/.02)*.35; i=int(k*.25*SR); o[i:i+len(s)]+=s
    return o
def wind(): t=tt(1.4); x=f(rng.standard_normal(len(t)),'bandpass',[300,1500]); return x*np.sin(np.pi*t/1.4)**2*.25
def fail():
    t=tt(1.0); fr=np.where(t<.25,392,np.where(t<.5,370,np.where(t<.75,349,330))); x=np.sign(np.sin(2*np.pi*np.cumsum(fr)/SR))*.5+np.sin(2*np.pi*np.cumsum(fr)/SR)
    return f(x,'lowpass',2000)*np.exp(-np.maximum(0,t-.75)/.2)*.08
def rise(): t=tt(.6); x=f(rng.standard_normal(len(t)),'bandpass',[400,8000]); return x*(t/.6)**2*.3
def boom(): t=tt(1.2); return (np.sin(2*np.pi*np.cumsum(35+120*np.exp(-t/.05))/SR)*np.exp(-t/.5)+f(rng.standard_normal(len(t)),'lowpass',600)*np.exp(-t/.15)*.4)*.6
def ding(): t=tt(.6); return (np.sin(2*np.pi*1568*t)+.4*np.sin(2*np.pi*3136*t))*np.exp(-t/.15)*.08
def cheer():
    t=tt(2.0); x=f(rng.standard_normal(len(t)),'bandpass',[500,3500])*(.6+.4*np.sin(2*np.pi*3*t+rng.uniform(0,6)))
    return x*np.sin(np.pi*np.minimum(1,t/2.0))*.22
FX=dict(hit=hit,pop=pop,swish=swish,scratch=scratch,type=typ,buzz=buzz,steps=steps,wind=wind,fail=fail,rise=rise,boom=boom,ding=ding,cheer=cheer)
# music stops briefly on scratch (comic freeze)
for e in m['sfx']:
    if e['type']=='scratch':
        i=int(e['t']*SR); j=min(N,i+int(.9*SR)); L[i:j]*=np.linspace(.1,1,j-i); R[i:j]*=np.linspace(.1,1,j-i)
for e in m['sfx']:
    s=FX.get(e['type'],pop)(); i=int(e['t']*SR)
    if 0<=i<N: L[i:i+len(s)]+=s[:N-i]; R[i:i+len(s)]+=s[:N-i]
mix=np.stack([L,R],1); mix=np.tanh(mix/np.max(np.abs(mix))*1.15)
fd=int(1.0*SR); mix[-fd:]*=np.linspace(1,0,fd)[:,None]; mix/=np.max(np.abs(mix))/.89
wavfile.write(out,SR,(mix*32767).astype(np.int16)); print('ok',DUR)
