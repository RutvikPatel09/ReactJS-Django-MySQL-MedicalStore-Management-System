# Generated by Django 3.2.2 on 2021-06-04 12:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('BestCarePharmacyApp', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='medicine',
            name='medicine_img',
            field=models.FileField(default='', upload_to=''),
        ),
    ]