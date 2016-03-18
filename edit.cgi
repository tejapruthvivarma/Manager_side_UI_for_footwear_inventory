#!/usr/bin/perl 

# Nadimpally, Teja Pruthvi Varma
#jadrn037
# CS0645, Spring 2016
# Proj1
#
use CGI;
use DBI;
use CGI::Session;
use CGI::Carp qw (fatalsToBrowser);

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
    print "Error occured - <a href='http://jadran.sdsu.edu/~jadrn037/proj1/index.html'>Please Login to Continue</a>";
    exit; # terminate the script after printing
}

my ($key, $value);
our $sku;
our $category;
our $vendor;
our $mId;
our $description;
our $features;
our $cost;
our $retail;
our $image;
                
foreach $key ($q->param) {

if ($key =~ /sku/) {
	   $sku = $q->param($key);	
	}
	if ($key =~ /category/) {
	   $category = $q->param($key);	
	}
	if ($key =~ /vendor/) {
	   $vendor = $q->param($key);	
	}
	if ($key =~ /m_id/) {
	   $mId = $q->param($key);	
	}
	if ($key =~ /description/) {
	   $description = $q->param($key);	
	}
	if ($key =~ /features/) {
	   $features = $q->param($key);	
	}
	if ($key =~ /cost/) {
	   $cost = $q->param($key);	
	}
	if ($key =~ /retail/) {
	   $retail = $q->param($key);	
	}
	if ($key =~ /image/) {
	   $image = $q->param($key);	
	}
}

my $host = "opatija.sdsu.edu";
my $port = "3306";
my $database = "jadrn037";
my $username = "jadrn037";
my $password = "button";
my $database_source = "dbi:mysql:$database:$host:$port";

	
my $dbh = DBI->connect($database_source, $username, $password) 
or die 'Cannot connect to db'; 

my $delete_query = "DELETE FROM product WHERE sku_id = '$sku'";            
my $sth = $dbh->prepare($delete_query);
$sth->execute();

$query = $dbh->prepare("INSERT INTO product (sku_id, category_id, vendor_id, manufacturer_id, description, features, cost, retail, image ) VALUES ('$sku', '$category', '$vendor', '$mId', '$description', '$features', '$cost', '$retail', '$image')"); 
$query->execute();
$query->finish();
print "Content-type: text/html\n\n";
print "Stock unit".$sku." is updated sucessfully";

$sth->finish();
$dbh->disconnect();
