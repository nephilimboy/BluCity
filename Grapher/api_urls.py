from django.conf.urls import url
from rest_framework.urlpatterns import format_suffix_patterns
from .views import *

app_name = 'grapher'


urlpatterns = [
]

urlpatterns += format_suffix_patterns([

    url(r'^grapher/$',
        SrcGrapherView.as_view(),
        name='graph'),

    url(r'^grapher/(?P<pk>\d+)/$',
        SrcGrapherView.as_view(),
        name='grapher_get_timestamp'),
    #
    # url(r'^customPattern/$',
    #     CustomPatternView.as_view(),
    #     name='custom_pattern_list'),
    #
    # url(r'^customPattern/(?P<pk>\d+)/$',
    #     CustomPatternView.as_view(),
    #     name='custom_pattern_list'),
    #
    url(r'^taxi/$',
        TaxiService.as_view(),
        name='taxi'),
    #
    # url(r'^jasonParser/(?P<pk>\d+)/$',
    #     JasonParserView.as_view(),
    #     name='jason_parser_list_update'),
])
