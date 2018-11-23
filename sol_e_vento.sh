#!/bin/bash



cd home/pi/Sol_e_Vento
python Comunicacao.py & PID_P1=$!
cd app
node app.js & PID_P2=$!

exit 0

