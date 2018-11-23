#Classe abstrata que tera os medidore analogicos do sistema
import time
import Adafruit_GPIO.SPI as SPI
import Adafruit_MCP3008
import RPi.GPIO as GPIO

#Contrutor do medidor
class Medidor(object):
    def __init__(self, canal):
        super(Medidor, self).__init__()
        self.canal = canal
        self.medicao = 0        
        self.CLK  = 22
        self.MISO = 27
        self.MOSI = 17
        self.CS   = 4
        self.mcp = Adafruit_MCP3008.MCP3008(clk=self.CLK, cs=self.CS, miso=self.MISO, mosi=self.MOSI)

#Classe que retornara a medida extraida do canal solicitado
    #@abstractmethod
    def medir(self):
        self.medicao = self.mcp.read_adc(self.canal)
        return self.medicao
