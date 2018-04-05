#!/usr/bin/python

import unittest

def getResponse(path, params=None):
    import json
    import urllib, urllib2
    # param = {'ajax': '1', 'htd': '20131111', 'pn': 'p1', 'htv': 'l'}
    value = urllib.urlencode(params) if params is not None else None
    # value = "ajax=1&htd=20131111&pn=p1&htv=l"
    req = urllib2.Request('https://o3f323b5k0.execute-api.us-east-1.amazonaws.com/dev/' + path, value)
    
    return json.load( urllib2.urlopen(req) )

# Create your tests here.
class TestServer(unittest.TestCase):
    def setUp(self):
        self.test = "testVar"

    def test_self(self):
        self.assertEqual(self.test, "testVar")

    def test_HelloWorld(self):
    	response = getResponse('helloworld')
        self.assertEqual( response['message'], 'Fuck yea!')

    def test_EmptyPage(self):
        response = getResponse('pages/delete', {'page_id':'abc'})
        self.assertEqual(response['success'], True)
        response = getResponse('pages/get', {'page_id':'abc'})
        self.assertEqual(response['content'], None)

    def test_UpdatePage(self):
        content = 'My name is Spencer'
        response = getResponse('pages/update', {
            'page_id':'abc',
            'content': content
        })
        self.assertEqual(response['success'], True)
        response = getResponse('pages/get', {'page_id':'abc'})
        self.assertEqual(response['content'], content)
        newContent = ' I love Stephanie Kan!!'
        response = getResponse('pages/update', {
            'page_id':'abc',
            'content': newContent
        })
        self.assertEqual(response['success'], True)
        response = getResponse('pages/get', {'page_id':'abc'})
        self.assertEqual(response['content'], newContent)

    def test_DeletePage(self):
        response = getResponse('pages/update', {
            'page_id':'abc',
            'content': 'soon to be deleted...'
        })
        self.assertEqual(response['success'], True)
        response = getResponse('pages/delete', {'page_id':'abc'})
        self.assertEqual(response['success'], True)


if __name__ == '__main__':
    suite = unittest.TestLoader().loadTestsFromTestCase(TestServer)
    unittest.TextTestRunner(verbosity=2).run(suite)