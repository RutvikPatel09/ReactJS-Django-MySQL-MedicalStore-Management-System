# Generated by Django 3.2.2 on 2021-06-10 12:51

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('BestCarePharmacyApp', '0004_users'),
    ]

    operations = [
        migrations.AddField(
            model_name='companyaccount',
            name='added_on',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]
