import sys, unittest, json, os
from unittest.mock import patch
import server
class Response:
 def __enter__(self):return self
 def __exit__(self,*a):pass
 def read(self):return b'{"id":"test-message"}'
class Tests(unittest.TestCase):
 def test_validation(self):
  for data in [{},{'name':'A','contact':'invalid','product':'B','consent':True},{'name':'A','contact':'a@b.com','product':'B','consent':False}]:
   with self.assertRaises(ValueError):server.validate(data)
 def test_missing_key(self):
  with patch.dict(os.environ,{},clear=True):self.assertEqual(server.send_email({})[0],503)
 def test_provider_request(self):
  fields=server.validate({'name':'Анна','contact':'a@b.com','product':'Косметика','consent':True})
  with patch.dict(os.environ,{'VFC_MAIL_API_KEY':'test-only'}),patch('server.urlopen',return_value=Response()) as send:
   self.assertEqual(server.send_email(fields)[0],200)
   req=send.call_args.args[0];data=json.loads(req.data)
   self.assertEqual(req.full_url,'https://api.resend.com/emails')
   self.assertEqual(data['to'],['nastanikol10105@gmail.com']);self.assertEqual(data['reply_to'],'a@b.com');self.assertIn('Косметика',data['text'])
 def test_provider_failure(self):
  with patch.dict(os.environ,{'VFC_MAIL_API_KEY':'test-only'}),patch('server.urlopen',side_effect=OSError('private details')):
   status,message=server.send_email({'name':'A','contact':'a@b.com','product':'B'})
   self.assertEqual(status,502);self.assertNotIn('private details',message)
unittest.main()
