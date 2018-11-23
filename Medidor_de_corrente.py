#Classe Medidor_de_corrente extende a classe Medidor
#Mede os valores de tensao obtidos atraves do transdutor de corrente ACS712 20A, para o qual cada ampere representa 100mV
from Medidor import Medidor

class Medidor_de_corrente(Medidor):
    
    def __init__(self, canal):
        super(Medidor_de_corrente, self).__init__(canal)
        self.medicao = 0.0

        
    def calcular(self):
        medicao_de_off_set = 726.0 #tensao de corrente = 0 no medidor acs712, para valores abaixo a corrente e negativa, acima ela e positiva
        passo_por_ampere = 31.0 #cada ampere medido provoca acrescimo de 31 na medida no adc, equivalente a 100mV
        self.medicao = self.medir()
        self.medicao = (self.medicao - medicao_de_off_set) / passo_por_ampere
        return str("%.2f"% self.medicao)

#m = Medidor_de_corrente(4)
#print (str("%.2f" % m.calcular())+"A")
