from rest_framework import serializers

# from .codeParser import *
from .models import *


class SrcGrapherSerializer(serializers.ModelSerializer):
    class Meta:
        model = SrcElement
        fields = ("id", "level", "name", "kind", "startPoint", "endPoint", "localElements", "foreignElements")

    # def __init__(self):
        # self.codeParser = CodeParser()
        # def create(self, validated_data):
    #     jason_alias_data = validated_data.pop('jason_alias')
    #     jasonParser = JasonParser.objects.create(**validated_data)
    #     for jason_alias in jason_alias_data:
    #         jason_alias, created = JasonParserAlias.objects.get_or_create(jasonParser=jasonParser, **jason_alias)
    #     jasonParser.save()
    #     return jasonParser
    #
    # def update(self, instance, validated_data):
    #     instance.name = validated_data.get('name', instance.name)
    #     instance.jason = validated_data.get('jason', instance.jason)
    #
    #     # delete alias which is not presented in the input jason
    #     for current_alias in instance.jason_alias.all():
    #         isInstanceAvailable = False
    #         for jason_alias_valid_data in validated_data['jason_alias']:
    #             if current_alias.id == jason_alias_valid_data.get('id', None):
    #                 isInstanceAvailable = True
    #                 break
    #         if not isInstanceAvailable:
    #             current_alias.delete()
    #
    #     for jason_alias_valid_data in validated_data['jason_alias']:
    #         jason_alias_valid_data_id = jason_alias_valid_data.get('id', None)
    #         if jason_alias_valid_data_id:
    #             jasonParserAlias_original = JasonParserAlias.objects.get(pk=jason_alias_valid_data_id)
    #             jasonParserAlias_original.name = jason_alias_valid_data.get('name', None)
    #             jasonParserAlias_original.path = jason_alias_valid_data.get('path', None)
    #             jasonParserAlias_original.save()
    #         else:
    #             jasonParserAlias_new = JasonParserAlias.objects.create(jasonParser=instance, **jason_alias_valid_data)
    #             jasonParserAlias_new.save()
    #             instance.jason_alias.add(jasonParserAlias_new)
    #
    #     instance.save()
    #     return instance


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
