#!/usr/bin/perl
 
# Nadimpally, Teja Pruthvi Varma
#jadrn037
# CS0645, Spring 2016
# Proj1

use CGI;
use DBI;
use CGI::Session;
use CGI::Carp qw (fatalsToBrowser);

my $q = new CGI;

my ($key, $value);
my $sku;
my $category;
my $vendor;
my $mId;
my $description;
my $features;
my $cost;
my $retail;
my $image;
                
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

my $check = "SELECT * FROM product WHERE sku_id = '$sku'";            
my $sth = $dbh->prepare($check);
$sth->execute();
my @row=$sth->fetchrow_array();  
if(@row != 0){   
	print "Content-type: text/html\n\n";
	print "SKU already exists";
}	
else {
	$query = $dbh->prepare("INSERT INTO product (sku_id, category_id, vendor_id, manufacturer_id, description, features, cost, retail, image ) VALUES ('$sku', '$category', '$vendor', '$mId', '$description', '$features', '$cost', '$retail', '$image')"); 
	$query->execute();
	$query->finish();
	print "Content-type: text/html\n\n";
	print "A new stock unit".$sku." is added sucessfully";
}

$sth->finish();
$dbh->disconnect();








