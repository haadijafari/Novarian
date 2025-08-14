from rest_framework import serializers

from apps.product.models.question_answer import QuestionAnswer


class QuestionAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionAnswer
        fields = '__all__'
