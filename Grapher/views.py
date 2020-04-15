from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
import numpy as np
import pandas as pd

class SrcGrapherView(APIView):

    def get(self, format=None):
        return Response(getTimeStampLight(),
                        status=status.HTTP_202_ACCEPTED)

    def post(self, request, pk):
        return Response(getTimeStampObjects(int(pk)),
                        status=status.HTTP_202_ACCEPTED)



class TaxiService(APIView):

    def get(self, format=None):
        return Response('jsjsjsjs29292929',
                        status=status.HTTP_202_ACCEPTED)

    def post(self, request, pk):
        return Response(getTimeStampObjects(int(pk)),
                        status=status.HTTP_202_ACCEPTED)


def getTimeStampObjects(timestamp):
    path = '/Users/amir/Documents/pycharmWorkspace/BlueCity/Grapher/'
    P_car = pd.read_csv(path + 'DATA_20200323_180424_frozenNotTensorRtBigGood.csv', skiprows=1)
    P_ped = pd.read_csv(path + 'DATA_20200323_180424_bigPed_pedestrians.csv')
    P_car = np.array(P_car)
    P_ped = np.array(P_ped)
    P = np.concatenate((P_car, P_ped), axis=0)
    P[:, 2] = (P[:, 2] / 0.05)
    P[:, 3] = (P[:, 3] / 0.05)
    P[:, 0] = (P[:, 0] * 10)
    P = P.astype(np.int)
    allObject = {}
    for timeStamp in range(25489, 32249):
        P_sub = P[P[:, 0] == timeStamp, :]
        temp = []
        for i in range(len(P_sub)):
            temp.append({
                'id': P_sub[i, 1],
                'x': P_sub[i, 2],
                'y': P_sub[i, 3],
                'type': P_sub[i, 4]
            })
        allObject[timeStamp] = temp
    # return allObject[timestamp]
    return allObject


def getTimeStampLight():
    path = '/Users/amir/Documents/pycharmWorkspace/BlueCity/Grapher/'
    P_light = pd.read_csv(path + 'trafficLights.csv')
    P_light = np.array(P_light)
    P_light[:, 1] = (P_light[:, 1] * 10).astype(np.int)
    allObject = {}
    for i in P_light:
        temp = []
        timestamp = i[1]
        cl1 = i[2]
        cl3 = i[3]
        cl2 = i[4]
        pl1 = i[5]
        pl3 = i[6]
        pl2 = i[7]
        pl4 = i[8]
        temp.append({
            'cl1': cl1,
            'cl3': cl3,
            'cl2': cl2,
            'pl1': pl1,
            'pl3': pl3,
            'pl2': pl2,
            'pl4': pl4,
        })
        allObject[timestamp] = temp
    return allObject
