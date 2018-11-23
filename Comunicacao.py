from Medidor_de_corrente import Medidor_de_corrente
from Medidor_de_tensao import Medidor_de_tensao
from Medidor_de_giro import Medidor_de_giro
from Comando import Comando
import sys, errno, signal
import socket
#from socket import socket,AF_INET,SOCK_STREAM
import threading
from threading import Thread
import time

class Comunicacao(threading.Thread):
	
	def __init__(self):
		super(Comunicacao, self).__init__()
                self._stop = threading.Event()
                #self.serv = socket(socket.AF_INET, socket.SOCK_STREAM)
                self.serv = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
		self.serv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1) 
		self.cliente = None
		self.recebida = ''
		self.saida = ''
		self.thread_envio = Thread(target=self.enviar)
		self.thread_receber = Thread(target=self.receber)
		#elf.pont_cliente = None
	
	def pegar_medidas(self): #funcao que retorna a string contendo as leituras do adc
		medidores = [Medidor_de_giro(0,12), Medidor_de_tensao(1), Medidor_de_tensao(2), Medidor_de_tensao(3), Medidor_de_corrente(4), Medidor_de_corrente(5), Medidor_de_corrente(6)]
		medidas = ''
		for i in range(7):
			medidas += str(medidores[i].calcular()) + ','
		return medidas
	
	def put(self, medidas):
		if self.cliente != None:
			self.cliente.send(str.encode(medidas))
	
	def enviar(self):
		#msg = raw_input()
		try:
			while (self.saida <> '^X'):
				time.sleep(0.5)
				medidas = self.pegar_medidas()
				#print self.recebida			
				self.put(medidas)
				#msg = raw_input()
		except socket.error:
			self.cliente.close()
			
		except KeyboardInterrupt:
			self.serv.close()
			exit(0)
	
	def receber(self):
		try:
			while (self.saida <> '^X'):
				if self.cliente != None:
					self.recebida = self.cliente.recv(1024)
					try:
						if int(self.recebida) < 16:
							comando = Comando()
							comando.executar(self.recebida)
					except ValueError:
						print "valor recebido nao eh um inteiro"
						print str(self.recebida)
						exit(0)
						#return self.recebido		
		except KeyboardInterrupt:
			self.serv.close()
			exit(0)
		return self.recebido


	def servidor(self):		
		host = ''
		porta = 5000
		origem = (host,porta)
		self.serv.bind(origem)
		self.serv.listen(1)
		print("Servidor", "esperando conexao na porta", porta)
		try:
			
			while True:
				try:
					(socket_cliente,addr) = self.serv.accept()
					print("Conectado a:", str(addr))
					self.cliente = socket_cliente
					#self.pont_cliente = &socket_cliente
					self.thread_envio = Thread(target=self.enviar)				
					self.thread_envio.start()
					self.thread_receber = Thread(target=self.receber)					
					self.thread_receber.start()
					if self._stop.isSet():
						print("entrou no isSet")
						exit(0)
					#self.thread_envio.join()
					#self.thread_receber.join()
				except KeyboardInterrupt:
					#self.serv.close()
					#self.thread_envio.join()
					#self.thread_receber.join()
					print "fechei o servidor"
				except socket.error:
					print "O cliente caiu"
					
		except KeyboardInterrupt:
			self.serv.close()
			self.thread_envio.join()
			self.thread_receber.join()
			print "fechei o servidor"
		finally:
			self.serv.close()
			#self.thread_envio.join()
			#self.thread_receber.join()
			print "fechei o servidor"

		#self.enviar()

	def sair(self, sig, frame):
		print "Voce precionou CTRL + C"	
		return self._stop.isSet()
		#self.pont_cliente.close()
		#self.serv.close()
	
	def comunicar(self):
 
		c = Comunicacao()
		#c.servidor()
		#signal.signal(signal.SIGINT, self.sair)
		
		thread_conexao = Thread(target=c.servidor)
		
		#thread_saida = Thread(target=c.sair)
		
		#thread_saida = Thread(target=c.sair)
		
		
		thread_conexao.start()
		#thread_saida.start()
		#signal.pause()
		
		#signal.pause()
		
		

		thread_conexao.join()
		
		#thread_saida.join()
		#c.cliente.close()
		c.serv.close()
		print "fechei o servidor"


c = Comunicacao()
c.comunicar()

