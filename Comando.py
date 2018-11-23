import RPi.GPIO as GPIO
import time
#classe comando recebe atraves da funcao executar(comando) um numero de 00 a 15, que e convertido em binario 
#e transformado no status dos 4 canais de saida do sistema
class Comando:
	
	def __init__(self):
		self.recebido = 0 #valor de comando que sera recebido
		self.canal = [18,23,24,25] #lista de canais ocupados na interface GPIO
		self.lista_de_comandos = ['','','',''] # array que tera os valores binarios
		GPIO.setwarnings(False) #desbilita os warnings chatos do GPIO
		GPIO.setmode(GPIO.BCM)
		for i in range(4): #seta as portas como saida digital
			GPIO.setup(self.canal[i], GPIO.OUT)

	#essa funcao recebe a mensagem e a transforma num array de 4 bits, cada um representando um canal de 1 a 4
	def abrir_mensagem(self, recebido):
		try:
			recebido = int(recebido)			
			if recebido >= 0 and recebido <= 15:
				self.recebido = format(recebido, 'b') #transforma o valor recebido em string com formato binario
				self.recebido = '%(number)04d' %{"number": int(self.recebido)} #formata a string binaria para que tenha sempre 4 bits
				print self.recebido
		except ValueError:
			print "valor recebido nao eh um inteiro"
			return self.recebido
		return self.recebido

	#funcao que eh invocada pela classe que lida com os sockets, recebe de la o comando e o executa na GPIO
	def executar(self, recebido):
		self.lista_de_comandos = self.abrir_mensagem(recebido)
		#while True:
		for i in range(4):
			GPIO.output(self.canal[i],int(self.lista_de_comandos[i]))


#c = Comando()
#c.executar(15)

	
