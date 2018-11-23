#Classe Medidor_de_tensao extende a classe Medidor
#Essa classe realiza a medida de tensao CC
from Medidor import Medidor

class Medidor_de_tensao(Medidor):
    
    def __init__(self, canal):
        super(Medidor_de_tensao, self).__init__(canal)
        self.medicao = 0.0

#O valor 0.00322580645161 na variavel passo_de_tensao representa quantos volts siginificam cada valor inteiro lido no ADC, que vai le de 0V a 3,3V,
#representados pelos valores inteiros de 0 a 1023 lidos no ADC.
#Metodo medir_tensao usa a medicao pura retirada do canal passado e faz a multiplicacao 
    def calcular(self):
	divisao_de_tensao = 10.8985576119576986
        passo_de_tensao = 0.00322580645161
        self.medicao = self.medir()
        self.medicao = float(self.medicao) * passo_de_tensao * divisao_de_tensao
        return str("%.2f"% self.medicao)
