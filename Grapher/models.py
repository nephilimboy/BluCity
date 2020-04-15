from django.db import models


class SrcElement(models.Model):
    level = models.CharField(max_length=50)
    name = models.CharField(max_length=50)
    kind = models.CharField(max_length=50)
    startPoint = models.CharField(max_length=50)
    endPoint = models.CharField(max_length=50)

    localElements = models.ManyToManyField('self', blank=True, null=True, related_name='+')
    foreignElements = models.ManyToManyField('self', blank=True, null=True, related_name='+')

    def __str__(self):
        return self.level + ' ' + self.name + ' ' + self.kind


class SrcCode(models.Model):
    code = models.TextField()

    def __str__(self):
        return self.code
