# Generated by Django 3.2.2 on 2021-06-25 12:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('BestCarePharmacyApp', '0010_rename_degree_doctor_doctor_type'),
    ]

    operations = [
        migrations.AlterField(
            model_name='doctor',
            name='added_on',
            field=models.DateTimeField(auto_now_add=True),
        ),
    ]
