import subprocess,sys
subprocess.run(["python3",sys.argv[0].rsplit("/",1)[0]+"/music_trio.py",sys.argv[1],sys.argv[2],"amapiano"],check=True)
