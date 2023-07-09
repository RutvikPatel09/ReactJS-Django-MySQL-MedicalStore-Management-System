# Generated by Django 3.2.2 on 2021-06-15 03:52

import BestCarePharmacyApp.models
from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('BestCarePharmacyApp', '0006_alter_customer_added_on'),
    ]

    operations = [
        migrations.AddField(
            model_name='customerrequest',
            name='prescription',
            field=models.FileField(default=django.utils.timezone.now, upload_to=BestCarePharmacyApp.models.upload_pres),
            preserve_default=False,
        ),
    ]