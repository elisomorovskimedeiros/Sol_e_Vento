import time
from threading import Thread
from Medidor import Medidor
from Medidor_de_tensao import Medidor_de_tensao
from Medidor_de_corrente import Medidor_de_corrente
from Medidor_de_giro import Medidor_de_giro
from Servidor import Servidor

class Comando:
	
	def __init__(self):
		self.comando = ''
	
	def executar(self, comando):
		self.comando = comando
		print (str(self.comando))

class ADC:

	def __init__(self):
		self.envio = None
		self.recebimento = None
		self.servidor = Servidor()
		self.msg_envio = ''
		#medicao de tensao do aerogerador
                #medicao de tensao do modulo solar
                #medicao do banco de baterias
                #medicao de corrente do aerogerador
                #medicao de corrente do modulo solar
                #medicao de corrente do banco de baterias
                #medicao de giro do aerogerador
    
        def externar_medidas(self):
		medidor = []
		medidor = [Medidor_de_giro(0,12), Medidor_de_tensao(1), Medidor_de_tensao(2), Medidor_de_tensao(3), Medidor_de_corrente(4), Medidor_de_corrente(5), Medidor_de_corrente(6)]
		medidas = [0.0,0.0,0.0,0.0,0.0,0.0,0.0]
		print self.msg_envio
		self.envio = Thread(self.servidor.enviar(self.msg_envio))
		
		try:
                    while True:                    
                            for i in range(7):
                                medidas[i] = medidor[i].calcular()
                                self.msg_envio = ("Tensao Aerogerador "+str(medidas[0])+"\n Tensao Modulo Solar "+str(medidas[1])+"\n Tensao Banco de Baterias "+str(medidas[2])+"\n Corrente Aerogerador "+str(medidas[3])+"\n Corrente Modulo Solar "+str(medidas[4])+"\n Corrente Banco de Baterias "+str(medidas[5])+"\n Giro do Aerogerador "+str(medidas[6])+"\n")                            
                                self.envio.start()
                                time.sleep(0.5)
                                #self.envio.join()
                except Exception as erro:
                    print "Deu erro dentro da funcao externar medidas"
                finally:
                    self.envio.join()
                    servidor.close()

        def enviar_receber(self):
            #try:
            self.servidor.esperar()
            self.externar_medidas()
                #self.receber_comandos()
            #except Exception as erro:
            #    print "O erro apontou na funcao enviar_receber"


adc = ADC()
adc.enviar_receber()
#print("Tensao Aerogerador ".medidas(0)."\n Tensao Modulo Solar ".medidas(1)."\n Tensao Banco de Baterias ".medidas(2)."\n Corrente Aerogerador ".medidas(3)."\n Corrente Modulo Solar ".medidas(4)."\n Corrente Banco de Baterias ".medidas(5)."\n Giro do Aerogerador ".medidas(6)."\n")
'''
		def receber_comandos(self):
			comando = Comando()
			while True:
				try:
					recebimento = Thread(servidor)
'''

