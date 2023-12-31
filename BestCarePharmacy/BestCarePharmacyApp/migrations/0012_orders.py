# Generated by Django 3.2.2 on 2021-08-20 05:22

import datetime
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('BestCarePharmacyApp', '0011_alter_doctor_added_on'),
    ]

    operations = [
        migrations.CreateModel(
            name='Orders',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('quantity', models.IntegerField(default=1)),
                ('price', models.IntegerField()),
                ('date', models.DateField(default=datetime.datetime(2021, 8, 20, 10, 52, 55, 841637))),
                ('customer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='BestCarePharmacyApp.users')),
                ('medicine', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='BestCarePharmacyApp.medicine')),
            ],
        ),
    ]
