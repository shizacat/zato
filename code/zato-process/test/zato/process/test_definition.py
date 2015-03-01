# -*- coding: utf-8 -*-

"""
Copyright (C) 2015 Dariusz Suchojad <dsuch at zato.io>

Licensed under LGPLv3, see LICENSE.txt for terms and conditions.
"""

from __future__ import absolute_import, division, print_function, unicode_literals

# stdlib
from unittest import TestCase

# nose
from nose.tools import eq_

# SQLAlchemy
import sqlalchemy
from sqlalchemy import orm

# Zato
from zato.common.odb.model import Base
from zato.process.definition import ProcessDefinition
from zato.process.vocab import en_uk

process1 = """
Config:

  Start: order.management from my.channel.feasibility-study

  Map service adapter.crm.delete.user to delete.crm
  Map service adapter.billing.delete.user to delete.billing

Pipeline:
  user_name: str
  user_id: int
  user_addresses: list
  user_social: dict

Path: order.management
  Require feasibility.study else reject.order
  Wait for signals patch.complete, drop.complete
  Enter order.complete

Handler: cease
  Ignore signals: amend, *.complete

  Invoke core.order.release-resources
  Invoke core.order.on-cease

Handler: amend
  Invoke core.order.amend

Handler: patch.complete
  Invoke core.order.patch-complete

Handler: drop.complete
  Invoke core.order.on-drop-complete

Path: feasibility.study
  Invoke core.order.feasibility-study

Path: order.complete
  Invoke core.order.notify-complete

Path: reject.order
  Invoke core.order.reject
  Emit order.rejected
"""

class DefinitionTestCase(TestCase):

    def setUp(self):
        engine = sqlalchemy.create_engine('sqlite://') # I.e. :memory: in SQLite speak
        Base.metadata.create_all(engine)
        self.session = orm.sessionmaker()
        self.session.configure(bind=engine)

    def assert_definitions_equal(self, pd1, pd2):
        eq_(pd1.to_yaml(), pd2.to_yaml())

    def get_process1(self):
        pd = ProcessDefinition()
        pd.text = process1.strip()
        pd.lang_code = 'en_uk'
        pd.vocab_text = en_uk
        pd.parse()

        return pd

    def xtest_yaml_roundtrip(self):
        pd = self.get_process1()
        self.assert_definitions_equal(pd, ProcessDefinition.from_yaml(pd.to_yaml()))

    def test_sql_rountrip(self):
        print(self.session)