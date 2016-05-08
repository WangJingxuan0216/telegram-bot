from scrapy.item import Item, Field
from scrapy import Spider
from scrapy.settings import Settings
import datetime

DATETIME_FORMAT="%Y-%m-%d %H:%M:%S"

settings = Settings()
settings.set('CONCURRENT_REQUESTS',32)
settings.set('DOWNLOAD_DELAY', 3)

class DramaItem(Item):
	name = Field()
	number = Field()
	time = Field()
	link = Field()
	pass

class DramaSpider(Spider):
	name = "drama"
	allowed_domains = ["quanji.la"]
	start_urls = [
	"http://www.quanji.la/Zuixinmeiju/PCJMDGJMHDWJ49499/",
	"http://www.quanji.la/Zuixinmeiju/JPLMDSJ49413/",
	"http://www.quanji.la/Zuixinmeiju/SHDBZDJJ48619/",
	"http://www.quanji.la/Zuixinmeiju/FZXLDSYJ48804/",
	"http://www.quanji.la/Zuixinmeiju/BYHZGQLDYXDLJ51034/",
	"http://www.quanji.la/Zuixinmeiju/SGXZDSYJ48857/"
	]

	def parse(self, response):
		time_now = datetime.datetime.now()
		for drama in response.xpath("//div[@class='lm']"):
			drama_name = DramaItem()
			drama_name['name'] = drama.xpath("h1/a//text()").extract()[-1].encode('utf-8')
			drama_name['number'] = drama.xpath("h1/font//text()").extract()[0]
			drama_name['time'] = drama.xpath('p//text()').extract()[0]
			last_update_time = datetime.datetime.strptime(drama_name['time'], DATETIME_FORMAT)
			interval = abs((last_update_time - time_now).total_seconds()/3600)
			if interval < 24:
				for download in response.xpath("//ul[@id='ul1']/li/a"):
					drama_name['link'] = download.xpath("@href").extract()[-1]
				yield drama_name