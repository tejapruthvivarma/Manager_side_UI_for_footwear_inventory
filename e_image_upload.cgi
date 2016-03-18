#!/usr/bin/perl 

# Nadimpally, Teja Pruthvi Varma  
#jadrn037
# CS0645, Spring 2016
# Proj1

use CGI;
use CGI::Session;
use CGI::Carp qw (fatalsToBrowser);
use File::Basename;

my $q = new CGI;
my $cookie_sid = $q->cookie('jadrn037SID');
my $session = new CGI::Session(undef, $cookie_sid, {Directory=>'/tmp'});
my $sid = $session->id;

if($cookie_sid ne $sid) {
	login_error_page();
}

sub login_error_page {
    my $cookie = $q->cookie(jadrn037SID => '');
    print $q->header( -cookie=>$cookie ); #delete
    print "Error occured- <a href='http://jadran.sdsu.edu/~jadrn037/proj1/index.html'>Please Login to Continue</a>";
    exit; # terminate the script after printing
}

####################################################################
### constants
$CGI::POST_MAX = 1024 * 3000; # Limit file size to 3MB
my $upload_dir = '/home/jadrn037/public_html/proj1/i___es';
my $safe_filename_chars = "a-zA-Z0-9_.-";
####################################################################

my $sku= $q->param("e_sku");
my $filename = $q->param("e_image");
unless($filename) {
    die "There was a problem uploading the image; ";        
    }
    
my ($name, $path, $extension) = fileparse($filename, '/..*/');
$filename = $filename.$extension;
$filename =~ s/ //; #remove any spaces
if($filename !~ /^([$safe_filename_chars]+)$/) {
    die "Sorry, invalid character in the filename.";
    }
    


$filename = untaint($filename);
$filename = lc($filename);

my ($img_extension) = (split(/\./, $filename))[-1];
$filename=$sku.'.'.$img_extension;


# get a handle on the uploaded image     
my $filehandle = $q->upload("e_image"); 

unless($filehandle) { die "Invalid handle"; }

# save the file
open UPLOADFILE, ">$upload_dir/$filename" or die
    "Error, cannot save the file.";
binmode UPLOADFILE;
while(<$filehandle>) {
    print UPLOADFILE $_;
    }
close UPLOADFILE;

print <<EOF;
Content-type:  text/html

<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
        "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">

<head>
	<meta http-equiv="content-type" 
		content="text/html;charset=utf-8" />	
</head>
<body>
<h2>Success, the file $filename has been uploaded</h2>
EOF
#print "<img src=\"/~jadrn000/proj1_examples/file_upload/_p_images/$filename\" />";
print <<EOF;
</body>
</html>
EOF

# this is needed because mod_perl runs with -T (taint mode), and thus the
# filename is insecure and disallowed unless untainted. Return values
# from a regular expression match are untainted.
sub untaint {
    if($filename =~ m/^(\w+)$/) { die "Tainted filename!"; }
    return $1;
    }
