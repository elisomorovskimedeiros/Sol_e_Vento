# Sol_e_Vento
Sistema de gerenciamento de usinas de micro geração de energia

Para configurar o sistema para inicializar automaticamente (exemplo do diretório do sistema copiado para /home/pi):

$sudo nano /etc/rc.local

Insira essas duas linhas antes do comando "exit 0":

#Script de inicializacao do Sol_e_Vento
service mongodb start
mongo &
./home/pi/Sol_e_Vento/sol_e_vento.sh &

pressione Ctrl+X para sair, e Y para aceitar sobrescrever.

###############
inicializar o mongodb no boot do linux:

update-rc.d mongodb defaults


