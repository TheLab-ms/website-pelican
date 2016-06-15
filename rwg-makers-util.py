#!/usr/bin/python
import subprocess, os
import SimpleHTTPServer, BaseHTTPServer, time, httplib, threading

# Local script variables
my_current_dir = "website-pelican"
my_content_dir = "../website-makers"
my_prod_config = "makersconf.py"
my_theme =       "themes/thelab-makers"
my_output =       "output"
my_output_sub =   "/makers"
#my_qa_config =   "qaconfig.py"
#my_qa_pubdir =   "../qa/website-content"


# Issue a warning
print "*****************************************************************"
print "*** This script was written to generate and deploy /makers    ***"
print "*****************************************************************"
print "*** This script was designed to be run in a linux environment    "
print "*** with the following configurations and assumptions:           "
print "*** Sript is run from a directory named website-pelican          "
print "***   Should contain the Master branch of website-pelican repo   "
print "*** Content directory is ../website-makers relative to script    "
print "***   Should contain the Master branch of website-makers repo    "
print "*** Output directory is ./output relative to script              "
print "***   Output is placed in ./output/makers directory relative       "
print "*** The Prod configuration file is makersconf.py                 "
#print "*** The QA configuration file qaconfig.py                        "
#print "*** The QA pub dir is ../qa/website-content relative to script   "
#print "***   Should contain the gh-pages branch of website-content repo "
#print "*** Github installed and configured for your system              "
#print "*** (You'll be prompted for github credentials on HTTPS clones)  "
print "*** S3cmd installed and configured with your AWS API key         "
print "*****************************************************************"
print "*** User assumes all risk and responsibility by continuing    ***"
print "*****************************************************************"
goahead = raw_input("Type Y to continue >")
if goahead.upper() != "Y":
  exit()

# Set up the local webserver in a stoppable way
class StoppableHttpRequestHandler (SimpleHTTPServer.SimpleHTTPRequestHandler):
    """http request handler with QUIT stopping the server"""
    def do_QUIT (self):
        """send 200 OK response, and set server.stop to True"""
        self.send_response(200)
        self.end_headers()
        self.server.stop = True

class StoppableHttpServer (BaseHTTPServer.HTTPServer):
    """http server that reacts to self.stop flag"""
    def serve_forever (self):
        """Handle one request at a time until stopped."""
        self.stop = False
        while not self.stop:
            self.handle_request()

def stop_server (port):
    """send QUIT request to http server running on localhost:<port>"""
    conn = httplib.HTTPConnection("localhost:%d" % port)
    conn.request("QUIT", "/")
    conn.getresponse()

def start_server (handler):
    """Start an HTTP server thread and return its port number."""
    server_address = ('localhost', 8000)
    handler.protocol_version = "HTTP/1.0"
    httpd = StoppableHttpServer(server_address, handler)
    port = 8000
    t = threading.Thread(None, httpd.serve_forever)
    t.start()
    # wait for server to start up
    while True:
        try:
            conn = httplib.HTTPConnection("localhost:%d" % port)
            conn.request("GET", "/")
            conn.getresponse()
            break
        except:
            time.sleep(0.5)
    return port


print "*****************************************************************"
print "*** Choose between the following options:                     ***"
print "*** G = Generate output using Prod makers config file           ***"
print "*** L = Launch a local webserver localhost:8000 with output   ***"
#print "*** Q = Generate output using QA config and publish to GHPage ***"
print "*** P = Generate output with Prod makers config + publish to AWS ***"
print "*****************************************************************"
option = raw_input("Enter Option >")
#if option.upper() in "GLPQ":
if option.upper() in "GLP":
  print "**************************"
  print "*** You Chose Option " + option.upper() + " ***"
  print "**************************"
else:
  print "*******************************************"
  print "*** You Chose Option " + option.upper() + " Which Is INVALID ***"
  print "*******************************************"
  exit()

if option.upper() == "G":
  # Generate output using Prod makers config file
  print "*** Generate output using Prod makers config file ***\n"
  subprocess.call(["pelican", my_content_dir, "-s", my_prod_config, "-t", my_theme])

if option.upper() == "L":
  # Launch a local webserver localhost:8000 with output
  print "*** Launch a local webserver localhost:8000 with output ***\n"
  os.chdir(my_output)
  mywebport = start_server(StoppableHttpRequestHandler)
  print "*******************************************************************"
  webquit = raw_input("Press Any Key To Stop Web Server - Might Take A Minute - Be Patient\n*******************************************************************\n")
  stop_server(mywebport)
  os.chdir("..")

# if option.upper() == "Q":
#  # Generate output using QA config file
#  print "*** Generate output using QA config file ***\n"
#  subprocess.call(["pelican", my_content_dir, "-s", my_qa_config, "-t", my_theme])
#  # Copy output to qa github pages directory
#  print "*** Copy output to qa github pages directory ***\n"
#  subprocess.call(["rsync", "-avu", "--exclude", ".git", "--delete", my_output + "/", my_qa_pubdir + "/"])
#  # Publish QA site as github page
#  print "*** Publish QA site as github page ***\n"
#  os.chdir(my_qa_pubdir)
#  subprocess.call(["git", "add", "*"])
#  subprocess.call(["git", "commit", "-a", "-m", "qa-update"])
#  subprocess.call(["git", "push", "origin", "gh-pages"])
#  os.chdir("../../" + my_current_dir)
#  print "*** DONE - QA Site Now Updated - Visit It HERE: http://thelab-ms.github.io/website-content/ ***"

if option.upper() == "P":
  # Generate output using Prod makers config file
  print "*** Generate output using Prod makers config file ***\n"
  subprocess.call(["pelican", my_content_dir, "-s", my_prod_config, "-t", my_theme])
  # Publish Prod makers site to AWS S3 bucket
  print "*** Publish Prod makers site to AWS S3 bucket ***\n"
  subprocess.call(["s3cmd", "sync", "./" + my_output + "/", "s3://thelab.ms.makers", "--acl-public", "--delete-removed", "--guess-mime-type"])
  print "*** DONE - Prod makers Site Now Updated - Visit It HERE: https://thelab.ms/makers/ ***"

print "*********************"
print "*** END OF SCRIPT ***"
print "*********************"
