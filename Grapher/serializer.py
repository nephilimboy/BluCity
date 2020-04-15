from rest_framework import serializers

# from .codeParser import *
from .models import *


class SrcGrapherSerializer(serializers.ModelSerializer):
    class Meta:
        model = SrcElement
        fields = ("id", "level", "name", "kind", "startPoint", "endPoint", "localElements", "foreignElements")



class SrcCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = SrcElement
        fields = ("id", "code")

    def create(self, validated_data):
        # test = validated_data.pop('code')
        # print(test)
        # codeParser = CodeParser()
        # parsedSourceCode = codeParser.start(test)

        # jasonParser = JasonParser.objects.create(**validated_data)
        # for jason_alias in jason_alias_data:
        #     jason_alias, created = JasonParserAlias.objects.get_or_create(jasonParser=jasonParser, **jason_alias)
        # jasonParser.save()
        return None
