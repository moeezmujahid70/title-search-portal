# Generated by Django 5.2.4 on 2025-07-15 16:16

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0003_statuschoice'),
    ]

    operations = [
        migrations.AlterField(
            model_name='certificate',
            name='status',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='core.statuschoice'),
        ),
    ]
